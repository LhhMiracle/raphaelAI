export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
  isFavorite?: boolean;
  settings?: GenerationSettings;
}

export interface GenerationSettings {
  steps: number;
  guidanceScale: number;
  width: number;
  height: number;
  style?: string;
}

export const STYLE_PRESETS = [
  { value: 'none', label: 'None', prompt: '' },
  { value: 'cinematic', label: 'Cinematic', prompt: ', cinematic lighting, highly detailed, professional photography' },
  { value: 'anime', label: 'Anime', prompt: ', anime style, vibrant colors, studio ghibli inspired' },
  { value: 'photorealistic', label: 'Photorealistic', prompt: ', photorealistic, 8k uhd, high quality, detailed' },
  { value: 'digital-art', label: 'Digital Art', prompt: ', digital art, artstation, concept art, smooth, sharp focus' },
  { value: 'oil-painting', label: 'Oil Painting', prompt: ', oil painting, classical art, brushstrokes, canvas texture' },
  { value: 'watercolor', label: 'Watercolor', prompt: ', watercolor painting, soft colors, artistic' },
  { value: 'cyberpunk', label: 'Cyberpunk', prompt: ', cyberpunk, neon lights, futuristic, sci-fi' },
  { value: 'fantasy', label: 'Fantasy', prompt: ', fantasy art, magical, ethereal, dreamy' },
  { value: '3d-render', label: '3D Render', prompt: ', 3d render, octane render, unreal engine, highly detailed' },
] as const;

export const IMAGE_SIZES = [
  { label: 'Square (1:1)', width: 1024, height: 1024 },
  { label: 'Portrait (2:3)', width: 768, height: 1152 },
  { label: 'Landscape (3:2)', width: 1152, height: 768 },
  { label: 'Wide (16:9)', width: 1344, height: 768 },
] as const;
