import { useState, useEffect } from 'react';

const STORAGE_KEY = 'saveKey';

/**
 * Custom hook for managing favorite movies with localStorage persistence.
 * @returns {Object} Object containing favorites array and methods to add/remove favorites
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (savedFavorites && Array.isArray(savedFavorites)) {
        setFavorites(savedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  /**
   * Saves favorites array to localStorage.
   * @param {Array} items - Array of favorite movies to save
   */
  const saveToLocalStorage = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  };

  /**
   * Adds a movie to favorites if it's not already present.
   * Updates state and persists to localStorage.
   * @param {Object} movie - The movie object to add to favorites
   */
  const addFavorite = (movie) => {
    if (favorites.some((favMovie) => favMovie.imdbID === movie.imdbID)) {
      return;
    }

    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  /**
   * Removes a movie from favorites.
   * Updates state and persists to localStorage.
   * @param {Object} movie - The movie object to remove from favorites
   */
  const removeFavorite = (movie) => {
    const newFavoriteList = favorites.filter(
      (favorite) => favorite.imdbID !== movie.imdbID
    );
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
  };
};

