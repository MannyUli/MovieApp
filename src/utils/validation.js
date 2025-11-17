/**
 * Sanitizes a poster URL string
 * @param {string|undefined|null} poster - The poster URL to sanitize
 * @returns {string} - The sanitized poster string
 */
export const sanitizePoster = (poster) => {
  if (!poster) return '';
  return String(poster).trim();
};

/**
 * Poster cache stored in localStorage
 */
const POSTER_CACHE_KEY = 'validatedPosters';
let posterCache = null;

/**
 * Loads the poster cache from localStorage
 * @returns {Set} Set of validated poster URLs
 */
const loadPosterCache = () => {
  if (posterCache !== null) return posterCache;
  
  try {
    const cached = localStorage.getItem(POSTER_CACHE_KEY);
    if (cached) {
      posterCache = new Set(JSON.parse(cached));
      return posterCache;
    }
  } catch (error) {
    console.error('Error loading poster cache:', error);
  }
  
  posterCache = new Set();
  return posterCache;
};

/**
 * Saves the poster cache to localStorage
 * @param {Set} cache - Set of validated poster URLs
 */
const savePosterCache = (cache) => {
  try {
    localStorage.setItem(POSTER_CACHE_KEY, JSON.stringify(Array.from(cache)));
  } catch (error) {
    console.error('Error saving poster cache:', error);
  }
};

/**
 * Adds a poster URL to the cache
 * @param {string} posterUrl - The poster URL to cache
 */
export const cacheValidPoster = (posterUrl) => {
  const cache = loadPosterCache();
  if (posterUrl && !cache.has(posterUrl)) {
    cache.add(posterUrl);
    savePosterCache(cache);
  }
};

/**
 * Checks if a poster URL is in the cache
 * @param {string} posterUrl - The poster URL to check
 * @returns {boolean} True if the poster is cached as valid
 */
export const isPosterCached = (posterUrl) => {
  const cache = loadPosterCache();
  return cache.has(posterUrl);
};

/**
 * Validates if a movie/show has a valid poster URL
 * Uses cache for faster lookups, validates and caches new posters
 * @param {Object} item - The movie or show object
 * @returns {boolean} - True if the poster is valid, false otherwise
 */
export const hasValidPoster = (item) => {
  const posterStr = sanitizePoster(item?.Poster);
  if (!posterStr) return false;

  // Check cache first
  if (isPosterCached(posterStr)) {
    return true;
  }

  // Check for invalid values
  const invalidValues = ['n/a', 'none', 'null', 'undefined', ''];
  if (invalidValues.includes(posterStr.toLowerCase())) {
    return false;
  }

  // Must be at least 10 characters (minimum URL length)
  if (posterStr.length < 10) {
    return false;
  }

  // Must start with http:// or https://
  const hasHttp =
    posterStr.toLowerCase().startsWith('http://') ||
    posterStr.toLowerCase().startsWith('https://');
  
  if (!hasHttp) {
    return false;
  }

  // More lenient validation: accept any HTTP/HTTPS URL
  // Common OMDB poster domains include:
  // - m.media-amazon.com (Amazon CDN)
  // - ia.media-imdb.com (IMDB CDN)
  // - omdbapi.com
  // - imdb.com
  // We'll let the browser handle actual image validation via onError handlers
  
  // Cache valid posters
  cacheValidPoster(posterStr);
  return true;
};

/**
 * Validates if a movie/show has a valid title
 * @param {Object} item - The movie or show object
 * @returns {boolean} - True if the title is valid, false otherwise
 */
export const hasValidTitle = (item) => {
  const title = item?.Title;
  if (!title) return false;

  const titleStr = String(title).trim();
  const invalidValues = ['n/a', 'none', 'null', 'undefined'];

  return titleStr !== '' && !invalidValues.includes(titleStr.toLowerCase());
};

