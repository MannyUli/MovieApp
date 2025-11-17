import { useState, useEffect } from 'react';

const API_KEY = '1190b3a6';
const API_URL = 'https://www.omdbapi.com';

/**
 * Fetches a single page of shows from OMDB API.
 * @param {string} searchQuery - The search query string
 * @param {number} page - Page number to fetch
 * @returns {Promise<Array>} Array of show objects (filtered to only series)
 */
const fetchShowPage = async (searchQuery, page = 1) => {
  try {
    const url = `${API_URL}/?s=${searchQuery}&apikey=${API_KEY}&page=${page}&type=series`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseJson = await response.json();

    // Check for OMDB API errors (they return Response: "False" with Error field)
    if (responseJson.Response === 'False') {
      const errorMsg = responseJson.Error || 'Unknown API error';
      console.error(`OMDB API error for show page ${page}:`, errorMsg);
      return [];
    }

    if (responseJson.Search) {
      // Filter to only include series (shows)
      const shows = responseJson.Search.filter(item => item.Type === 'series');
      return shows;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching show page ${page}:`, error);
    return [];
  }
};

/**
 * Custom hook for fetching TV shows from OMDB API based on search value.
 * On initial load (empty search), fetches multiple pages to show more shows.
 * Filters results to only include series (TV shows).
 * @param {string} searchValue - The search query string
 * @returns {Array} Array of show objects (series only)
 */
export const useShowSearch = (searchValue) => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      const searchQuery = searchValue.trim();

      // If search is empty, fetch multiple pages for initial load
      if (!searchQuery) {
        const popularTerms = ['series', 'tv', 'drama', 'comedy', 'action'];
        const allShows = [];

        // Fetch multiple pages from different search terms
        for (const term of popularTerms) {
          // Fetch up to 2 pages per term (20 shows per term)
          for (let page = 1; page <= 2; page++) {
            const pageResults = await fetchShowPage(term, page);
            allShows.push(...pageResults);
            
            // Stop if we got fewer results than expected (no more pages)
            if (pageResults.length < 10) break;
          }
        }

        // Remove duplicates based on imdbID
        const uniqueShows = allShows.filter(
          (show, index, self) =>
            index === self.findIndex((s) => s.imdbID === show.imdbID)
        );

        setShows(uniqueShows);
      } else {
        // User search: fetch up to 3 pages
        const allShows = [];
        for (let page = 1; page <= 3; page++) {
          const pageResults = await fetchShowPage(searchQuery, page);
          allShows.push(...pageResults);
          
          // Stop if no more results
          if (pageResults.length < 10) break;
        }
        setShows(allShows);
      }
    };

    fetchShows();
  }, [searchValue]);

  return shows;
};

