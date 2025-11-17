import React, { useState, useEffect, useRef, useCallback } from 'react';
import Home from './Home';
import Modal from './Modal';
import { hasValidPoster, cacheValidPoster } from '../utils/validation';
import './HomeLanding.css';


const API_KEY = '1190b3a6';
const API_URL = 'https://www.omdbapi.com';

const CARDS_PER_SECTION = 14;

const SECTION_CONFIG = [
  {
    id: 'action',
    title: 'Action & Adventure',
    query: 'action',
    type: 'movie',
  },
  {
    id: 'comedy',
    title: 'Comedy',
    query: 'comedy',
    type: 'movie',
  },
  {
    id: 'animation',
    title: 'Animated Series',
    query: 'animated series',
    type: 'series',
  },
];

const uniqueByImdb = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.imdbID) {
      return false;
    }
    if (seen.has(item.imdbID)) {
      return false;
    }
    seen.add(item.imdbID);
    return true;
  });
};

const fetchSection = async ({ query, type }) => {
  const allResults = [];
  
  // Fetch multiple pages to ensure we have enough results after filtering
  for (let page = 1; page <= 3; page++) {
    const url = `${API_URL}/?s=${encodeURIComponent(query)}&type=${type}&apikey=${API_KEY}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      break; // Stop if request fails
    }
    const json = await response.json();
    
    // Check for OMDB API errors
    if (json.Response === 'False') {
      const errorMsg = json.Error || 'Unknown API error';
      console.error(`OMDB API error for ${query} page ${page}:`, errorMsg);
      break; // Stop if API error
    }
    
    if (json.Response !== 'True' || !json.Search || json.Search.length === 0) {
      break; // Stop if no more results
    }
    
    const filtered = uniqueByImdb(json.Search)
      .filter((item) => item?.Type?.toLowerCase() === type.toLowerCase())
      .filter(hasValidPoster);
    
    allResults.push(...filtered);
    
    // Stop if we have enough results or if this page had fewer than 10 results
    if (allResults.length >= CARDS_PER_SECTION * 2 || json.Search.length < 10) {
      break;
    }
  }

  return allResults.slice(0, CARDS_PER_SECTION * 2); // Fetch more than needed to account for filtering
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
    
    // Only use detail poster if it's valid, otherwise preserve original poster
    const detailPoster = json.Poster && json.Poster !== 'N/A' ? json.Poster : null;
    const poster = detailPoster && hasValidPoster({ Poster: detailPoster }) 
      ? detailPoster 
      : movie.Poster; // Preserve original poster if detail poster is invalid
    
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

const MovieCard = ({ movie, FavoriteComponent, onFavorite, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const handleFavorite = (event) => {
    event.stopPropagation();
    if (typeof onFavorite === 'function') {
      onFavorite(movie);
    }
  };

  const handleOpen = () => onSelect(movie);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <div className="home-section__card">
      <div
        className="home-section__poster-container image-container"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
      >
        {!imageError ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="home-section__poster"
            onError={() => setImageError(true)}
            onLoad={() => {
              // Cache the poster URL when image loads successfully
              if (movie.Poster) {
                cacheValidPoster(movie.Poster);
              }
            }}
          />
        ) : (
          <div className="home-section__poster home-section__poster--placeholder">
            <span>No poster</span>
          </div>
        )}
        <div
          className="overlay d-flex align-items-center justify-content-center"
          onClick={handleFavorite}
        >
          <FavoriteComponent />
        </div>
      </div>
      <div className="home-section__card-body">
        <h3 className="home-section__card-title">{movie.Title}</h3>
        {Number.isFinite(movie.rating) && (
          <p className="home-section__card-rating">IMDb rating: {movie.rating.toFixed(1)}</p>
        )}
        <p className="home-section__card-meta">Released: {movie.Year}</p>
        <p className="home-section__card-meta">Type: {movie.Type}</p>
      </div>
    </div>
  );
};

const HomeLanding = ({
  searchValue,
  movies,
  handleFavoritesClick,
  favoriteComponent: FavoriteComponent,
}) => {
  const [sections, setSections] = useState(() =>
    SECTION_CONFIG.reduce((acc, config) => {
      acc[config.id] = { items: [], loading: false, error: null, hasLoaded: false };
      return acc;
    }, {})
  );
  const [selectedMovie, setSelectedMovie] = useState(null);

  const sectionsRef = useRef(sections);
  const sectionRefs = useRef({});

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const loadSectionById = useCallback((id) => {
    const config = SECTION_CONFIG.find((section) => section.id === id);
    if (!config) {
      return;
    }

    const current = sectionsRef.current[id];
    if (!current || current.loading || current.hasLoaded) {
      return;
    }

    setSections((prev) => {
      const next = {
        ...prev,
        [id]: {
          ...prev[id],
          loading: true,
          error: null,
        },
      };
      sectionsRef.current = next;
      return next;
    });

    fetchSection(config)
      .then((items) => {
        if (!items || items.length === 0) {
          throw new Error(`No ${config.type}s found for "${config.query}"`);
        }
        return Promise.all(items.map(fetchMovieDetails));
      })
      .then((detailed) => {
        // Simply take the first movies with valid posters, no rating-based sorting
        const topSuggestions = detailed.slice(0, CARDS_PER_SECTION);

        setSections((prev) => {
          const next = {
            ...prev,
            [id]: {
              ...prev[id],
              items: topSuggestions,
              loading: false,
              error: null,
              hasLoaded: true,
            },
          };
          sectionsRef.current = next;
          return next;
        });
      })
      .catch((err) => {
        setSections((prev) => {
          const next = {
            ...prev,
            [id]: {
              ...prev[id],
              loading: false,
              error: err.message || 'Failed to load section',
              hasLoaded: true,
            },
          };
          sectionsRef.current = next;
          return next;
        });
      });
  }, []);

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id');
            if (id) {
              loadSectionById(id);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
      }
    );

    SECTION_CONFIG.forEach((config, index) => {
      const el = sectionRefs.current[config.id];
      if (el) {
        observer.observe(el);
        if (index === 0) {
          loadSectionById(config.id);
        }
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [loadSectionById, searchValue]);

  const trimmedSearch = searchValue.trim();

  if (trimmedSearch.length > 0) {
    return (
      <Home
        movies={movies}
        handleFavoritesClick={handleFavoritesClick}
        favoriteComponent={FavoriteComponent}
      />
    );
  }

  const RenderFavoriteComponent = FavoriteComponent || (() => null);

  return (
    <div className="home-landing">
      {SECTION_CONFIG.map((config) => {
        const sectionState = sections[config.id] || {
          items: [],
          loading: false,
          error: null,
          hasLoaded: false,
        };
        const cards = sectionState.items.slice(0, CARDS_PER_SECTION);
        const fillerCount = sectionState.hasLoaded
          ? Math.max(0, CARDS_PER_SECTION - cards.length)
          : 0;

        return (
          <section
            key={config.id}
            className="home-section"
            data-section-id={config.id}
            ref={(el) => {
              sectionRefs.current[config.id] = el;
            }}
          >
            <div className="home-section__header">
              <h2 className="home-section__title">{config.title}</h2>
              {sectionState.loading && (
                <span className="home-section__status">Loading…</span>
              )}
              {sectionState.error && !sectionState.loading && (
                <span className="home-section__status home-section__status--error">
                  {sectionState.error}
                </span>
              )}
            </div>

            <div className="home-section__grid">
              {cards.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  FavoriteComponent={RenderFavoriteComponent}
                  onFavorite={handleFavoritesClick}
                  onSelect={setSelectedMovie}
                />
              ))}
              {Array.from({ length: fillerCount }).map((_, index) => (
                <div
                  key={`${config.id}-spacer-${index}`}
                  className="home-section__card home-section__card--spacer"
                />
              ))}
            </div>
          </section>
        );
      })}

      {selectedMovie && (
        <Modal
          movie={selectedMovie}
          handleCloseModal={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default HomeLanding;
