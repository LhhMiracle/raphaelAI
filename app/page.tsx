'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GeneratedImage, GenerationSettings, STYLE_PRESETS, IMAGE_SIZES } from '@/lib/types';
import { storage } from '@/lib/storage';

const EXAMPLE_PROMPTS = [
  'A serene landscape with mountains at sunset, painted in watercolor style',
  'A futuristic city with flying cars and neon lights',
  'A cute cat wearing a wizard hat, magical sparkles around',
  'An astronaut riding a horse on Mars, red landscape',
  'A cozy coffee shop interior, warm lighting, rainy day outside',
  'A majestic dragon flying over a medieval castle',
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [favorites, setFavorites] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'favorites'>('generate');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Generation settings
  const [settings, setSettings] = useState<GenerationSettings>({
    steps: 20,
    guidanceScale: 7.5,
    width: 1024,
    height: 1024,
    style: 'none',
  });

  // Load history and favorites on mount
  useEffect(() => {
    setHistory(storage.getHistory());
    setFavorites(storage.getFavorites());
  }, []);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentImage(null);

    try {
      // Apply style preset to prompt
      const selectedStyle = STYLE_PRESETS.find(s => s.value === settings.style);
      const finalPrompt = prompt + (selectedStyle?.prompt || '');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          steps: settings.steps,
          guidanceScale: settings.guidanceScale,
          width: settings.width,
          height: settings.height,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        imageUrl: url,
        timestamp: Date.now(),
        settings: { ...settings },
      };

      setCurrentImage(newImage);
      storage.addToHistory(newImage);
      setHistory(storage.getHistory());
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `raphaelai-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFavorite = (image: GeneratedImage) => {
    storage.toggleFavorite(image);
    setFavorites(storage.getFavorites());
    setHistory(storage.getHistory());
    if (currentImage?.id === image.id) {
      setCurrentImage({ ...image, isFavorite: !storage.isFavorite(image.id) });
    }
  };

  const deleteFromHistory = (id: string) => {
    storage.removeFromHistory(id);
    setHistory(storage.getHistory());
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  const usePrompt = (promptText: string) => {
    setPrompt(promptText);
    setActiveTab('generate');
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      storage.clearHistory();
      setHistory([]);
      setCurrentImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                RaphaelAI
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Free AI Image Generator - Unlimited, No Sign-up Required
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'generate'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Generate
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Favorites ({favorites.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Input Panel */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Describe your image
                  </h2>

                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., A serene landscape with mountains at sunset, painted in watercolor style..."
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={4}
                    disabled={loading}
                  />

                  {/* Style Presets */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Style Preset
                    </label>
                    <select
                      value={settings.style}
                      onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      disabled={loading}
                    >
                      {STYLE_PRESETS.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Advanced Settings Toggle */}
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {showAdvanced ? '− Hide' : '+ Show'} Advanced Settings
                  </button>

                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Image Size
                        </label>
                        <select
                          value={`${settings.width}x${settings.height}`}
                          onChange={(e) => {
                            const size = IMAGE_SIZES.find(
                              (s) => `${s.width}x${s.height}` === e.target.value
                            );
                            if (size) {
                              setSettings({ ...settings, width: size.width, height: size.height });
                            }
                          }}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                          disabled={loading}
                        >
                          {IMAGE_SIZES.map((size) => (
                            <option key={size.label} value={`${size.width}x${size.height}`}>
                              {size.label} - {size.width}x{size.height}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Steps: {settings.steps}
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={settings.steps}
                          onChange={(e) => setSettings({ ...settings, steps: parseInt(e.target.value) })}
                          className="w-full"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          More steps = higher quality but slower
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Guidance Scale: {settings.guidanceScale}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="0.5"
                          value={settings.guidanceScale}
                          onChange={(e) =>
                            setSettings({ ...settings, guidanceScale: parseFloat(e.target.value) })
                          }
                          className="w-full"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Higher = follows prompt more closely
                        </p>
                      </div>
                    </div>
                  )}

                  {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

                  <button
                    onClick={generateImage}
                    disabled={loading || !prompt.trim()}
                    className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Image'
                    )}
                  </button>
                </div>

                {/* Example Prompts */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Example Prompts
                  </h3>
                  <div className="space-y-2">
                    {EXAMPLE_PROMPTS.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => usePrompt(example)}
                        className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Preview Panel */}
              <div>
                {currentImage ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Generated Image
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFavorite(currentImage)}
                          className={`p-2 rounded-lg transition-all ${
                            storage.isFavorite(currentImage.id)
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          } hover:scale-110`}
                          title={storage.isFavorite(currentImage.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {storage.isFavorite(currentImage.id) ? '❤️' : '🤍'}
                        </button>
                        <button
                          onClick={() => downloadImage(currentImage)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Download
                        </button>
                      </div>
                    </div>

                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={currentImage.imageUrl}
                        alt="Generated image"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Prompt:</strong> {currentImage.prompt}
                      </p>
                      {currentImage.settings && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {currentImage.settings.width}x{currentImage.settings.height} • Steps:{' '}
                          {currentImage.settings.steps} • Guidance: {currentImage.settings.guidanceScale}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center sticky top-24">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      No image yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Enter a prompt and click Generate to create your first image
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Generation History
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No history yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your generated images will appear here
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={img.imageUrl}
                        alt={img.prompt}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                        {img.prompt}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => usePrompt(img.prompt)}
                          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Reuse
                        </button>
                        <button
                          onClick={() => toggleFavorite(img)}
                          className={`p-2 rounded-lg transition-all ${
                            storage.isFavorite(img.id)
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          {storage.isFavorite(img.id) ? '❤️' : '🤍'}
                        </button>
                        <button
                          onClick={() => downloadImage(img)}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => deleteFromHistory(img.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Favorite Images
            </h2>

            {favorites.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the heart icon on images to save them here
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={img.imageUrl}
                        alt={img.prompt}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                        {img.prompt}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => usePrompt(img.prompt)}
                          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Reuse
                        </button>
                        <button
                          onClick={() => toggleFavorite(img)}
                          className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg transition-all"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => downloadImage(img)}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          ⬇️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© 2024 RaphaelAI. All images generated are free to use for personal or commercial projects.</p>
        </div>
      </footer>
    </div>
  );
}
