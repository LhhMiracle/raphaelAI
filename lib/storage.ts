import { GeneratedImage } from './types';

const HISTORY_KEY = 'raphaelai_history';
const FAVORITES_KEY = 'raphaelai_favorites';
const MAX_HISTORY = 50;

export const storage = {
  // History
  getHistory: (): GeneratedImage[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToHistory: (image: GeneratedImage) => {
    if (typeof window === 'undefined') return;
    try {
      const history = storage.getHistory();
      const newHistory = [image, ...history].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  },

  removeFromHistory: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const history = storage.getHistory();
      const newHistory = history.filter(img => img.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to remove from history:', error);
    }
  },

  clearHistory: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_KEY);
  },

  // Favorites
  getFavorites: (): GeneratedImage[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (image: GeneratedImage) => {
    if (typeof window === 'undefined') return;
    try {
      const favorites = storage.getFavorites();
      const exists = favorites.find(fav => fav.id === image.id);

      let newFavorites;
      if (exists) {
        // Remove from favorites
        newFavorites = favorites.filter(fav => fav.id !== image.id);
      } else {
        // Add to favorites
        newFavorites = [{ ...image, isFavorite: true }, ...favorites];
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return !exists; // Return new favorite status
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return false;
    }
  },

  isFavorite: (id: string): boolean => {
    const favorites = storage.getFavorites();
    return favorites.some(fav => fav.id === id);
  },
};
