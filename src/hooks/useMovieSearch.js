import { useState, useEffect } from 'react';

const API_KEY = '1190b3a6';
const API_URL = 'https://www.omdbapi.com';

/**
 * Fetches a single page of movies from OMDB API.
 * @param {string} searchQuery - The search query string
 * @param {number} page - Page number to fetch
 * @returns {Promise<Array>} Array of movie objects
 */
const fetchMoviePage = async (searchQuery, page = 1) => {
  try {
    const url = `${API_URL}/?s=${searchQuery}&apikey=${API_KEY}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseJson = await response.json();

    // Check for OMDB API errors (they return Response: "False" with Error field)
    if (responseJson.Response === 'False') {
      const errorMsg = responseJson.Error || 'Unknown API error';
      console.error(`OMDB API error for page ${page}:`, errorMsg);
      // Don't throw, just return empty array to continue gracefully
      return [];
    }

    if (responseJson.Search) {
      return responseJson.Search;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching movie page ${page}:`, error.message || error);
    return [];
  }
};

/**
 * Custom hook for fetching movies from OMDB API based on search value.
 * On initial load (empty search), fetches multiple pages to show more movies.
 * @param {string} searchValue - The search query string
 * @returns {Array} Array of movie objects
 */
export const useMovieSearch = (searchValue) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const searchQuery = searchValue.trim();

      // If search is empty, fetch multiple pages for initial load
      if (!searchQuery) {
        const popularTerms = ['movie', 'action', 'comedy', 'drama', 'thriller'];
        const allMovies = [];

        // Fetch multiple pages from different search terms
        for (const term of popularTerms) {
          // Fetch up to 2 pages per term (20 movies per term)
          for (let page = 1; page <= 2; page++) {
            const pageResults = await fetchMoviePage(term, page);
            allMovies.push(...pageResults);
            
            // Stop if we got fewer results than expected (no more pages)
            if (pageResults.length < 10) break;
          }
        }

        // Remove duplicates based on imdbID
        const uniqueMovies = allMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID)
        );

        setMovies(uniqueMovies);
      } else {
        // User search: fetch up to 3 pages
        const allMovies = [];
        for (let page = 1; page <= 3; page++) {
          const pageResults = await fetchMoviePage(searchQuery, page);
          allMovies.push(...pageResults);
          
          // Stop if no more results
          if (pageResults.length < 10) break;
        }
        setMovies(allMovies);
      }
    };

    fetchMovies();
  }, [searchValue]);

  return movies;
};

