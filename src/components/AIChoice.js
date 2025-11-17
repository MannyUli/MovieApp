import React, { useState } from 'react';
import './AIChoice.css';
import Modal from './Modal';
import { hasValidPoster, cacheValidPoster } from '../utils/validation';

const API_KEY = '1190b3a6';
const API_URL = 'https://www.omdbapi.com';

const sanitizePrompt = (prompt) => {
  if (!prompt) return [];
  return prompt
    .split(/,|\band\b|\bor\b/gi)
    .map((section) => section.trim())
    .filter(Boolean);
};

const buildQueries = (prompt) => {
  const keywords = sanitizePrompt(prompt);
  if (keywords.length === 0) {
    return ['popular movies'];
  }
  return keywords.length > 3 ? keywords.slice(0, 3) : keywords;
};

const uniqueByImdb = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.imdbID) return false;
    if (seen.has(item.imdbID)) return false;
    seen.add(item.imdbID);
    return true;
  });
};

const fetchMoviesForQuery = async (query) => {
  const url = `${API_URL}/?s=${encodeURIComponent(query)}&apikey=${API_KEY}&type=movie`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const json = await response.json();
  
  // Check for OMDB API errors
  if (json.Response === 'False') {
    const errorMsg = json.Error || 'Unknown API error';
    console.error(`OMDB API error for query "${query}":`, errorMsg);
    return [];
  }
  
  if (json.Response !== 'True') {
    return [];
  }
  return json.Search?.filter(hasValidPoster) || [];
};

const fetchMovieDetails = async (movie) => {
  try {
    const url = `${API_URL}/?i=${movie.imdbID}&apikey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Detail request failed: ${response.status}`);
    }
    const json = await response.json();
    
    // Check for OMDB API errors
    if (json.Response === 'False') {
      const errorMsg = json.Error || 'Unknown API error';
      console.error(`OMDB API error fetching details for ${movie.imdbID}:`, errorMsg);
      return { ...movie, rating: null, votes: 0 };
    }
    
    if (json.Response !== 'True') {
      return { ...movie, rating: null, votes: 0 };
    }
    const rating = parseFloat(json.imdbRating);
    const votes = parseInt((json.imdbVotes || '0').replace(/,/g, ''), 10);
    const poster = json.Poster && json.Poster !== 'N/A' ? json.Poster : movie.Poster;
    return {
      ...movie,
      Poster: poster,
      rating: Number.isFinite(rating) ? rating : null,
      votes: Number.isFinite(votes) ? votes : 0,
    };
  } catch (error) {
    return { ...movie, rating: null, votes: 0 };
  }
};

const MovieSuggestionCard = ({ movie, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="ai-choice__card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(movie)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(movie);
        }
      }}
    >
      <div className="ai-choice__poster-wrapper">
        {!imageError && movie.Poster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="ai-choice__poster"
            onError={() => setImageError(true)}
            onLoad={() => {
              // Cache the poster URL when image loads successfully
              if (movie.Poster) {
                cacheValidPoster(movie.Poster);
              }
            }}
          />
        ) : (
          <div className="ai-choice__poster ai-choice__poster--placeholder">
            <span>No poster</span>
          </div>
        )}
      </div>
      <div className="ai-choice__card-body">
        <h3 className="ai-choice__title">{movie.Title}</h3>
        {Number.isFinite(movie.rating) && (
          <p className="ai-choice__rating">IMDb rating: {movie.rating.toFixed(1)}</p>
        )}
        <p className="ai-choice__meta">{movie.Year}</p>
        <p className="ai-choice__meta">Type: {movie.Type}</p>
      </div>
    </div>
  );
};

const AIChoice = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardSelect = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasInteracted(true);
    setLoading(true);
    setError(null);
    setSuggestions([]);

    const queries = buildQueries(prompt);

    try {
      const results = await Promise.all(queries.map(fetchMoviesForQuery));
      const flattened = uniqueByImdb(results.flat());

      if (flattened.length === 0) {
        setError('No suggestions found. Try refining your mood or keywords.');
        setLoading(false);
        return;
      }

      const detailPromises = flattened.slice(0, 20).map(fetchMovieDetails);
      const detailed = await Promise.all(detailPromises);

      const withValidPoster = detailed.filter(hasValidPoster);

      if (withValidPoster.length === 0) {
        setError('No high-rated matches with posters found. Try a different vibe.');
        setLoading(false);
        return;
      }

      const rated = withValidPoster
        .filter((movie) => Number.isFinite(movie.rating))
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.votes - a.votes;
        });

      const unrated = withValidPoster.filter((movie) => !Number.isFinite(movie.rating));

      const ordered = [...rated, ...unrated];
      const topSuggestions = ordered.slice(0, 5);

      if (topSuggestions.length === 0) {
        setError('No high-rated matches found. Try a different vibe.');
      } else {
        setSuggestions(topSuggestions);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-choice">
      <header className="ai-choice__header">
        <h2>Need a Recommendation?</h2>
        <p>Tell us how you feel and we'll bring back the most popular, top-rated picks to match your vibe.</p>
      </header>

      <form className="ai-choice__form" onSubmit={handleSubmit}>
        <label htmlFor="ai-choice-input" className="ai-choice__label">
          Enter mood, keywords, or genres
        </label>
        <div className="ai-choice__input-group">
          <input
            id="ai-choice-input"
            type="text"
            className="ai-choice__input"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="e.g. cozy, romantic comedy, feel good"
          />
          <button type="submit" className="ai-choice__button" disabled={loading}>
            {loading ? 'Searching...' : 'Find Movies'}
          </button>
        </div>
      </form>

      {error && <p className="ai-choice__error">{error}</p>}

      {!loading && hasInteracted && !error && suggestions.length === 0 && (
        <p className="ai-choice__empty">No suggestions yet. Try a different prompt like "funny spy flick" or "heartfelt dramas".</p>
      )}

      {suggestions.length > 0 && (
        <div className="ai-choice__results">
          {suggestions.map((movie) => (
            <MovieSuggestionCard movie={movie} onSelect={handleCardSelect} key={movie.imdbID} />
          ))}
        </div>
      )}

      {isModalOpen && selectedMovie && (
        <Modal movie={selectedMovie} handleCloseModal={handleCloseModal} />
      )}
    </section>
  );
};

export default AIChoice;
