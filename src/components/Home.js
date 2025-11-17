import React, { useState } from 'react';
import Modal from './Modal';
import { hasValidPoster, hasValidTitle, cacheValidPoster } from '../utils/validation';
import './Home.css';
/**
 * MovieCard component for rendering individual movie poster cards.
 * Handles image loading errors and hides cards with broken images.
 * @param {Object} movie - The movie object containing poster and title information
 * @param {Function} onPosterClick - Callback function when poster is clicked
 * @param {Function} onFavoriteClick - Callback function when favorite button is clicked
 * @param {React.Component} FavoriteComponent - Component to render as favorite button
 */
const MovieCard = ({ movie, onPosterClick, onFavoriteClick, FavoriteComponent }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Cache the poster URL when image loads successfully
    if (movie.Poster) {
      cacheValidPoster(movie.Poster);
    }
  };

  // Don't render the card if image fails to load
  if (imageError) {
    return null;
  }

  return (
    <div className='image-container d-flex justify-content-start m-3'>
      {!imageLoaded && (
        <div 
          className="image-placeholder" 
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            zIndex: 1
          }}
        >
          Loading...
        </div>
      )}
      <img 
        src={movie.Poster} 
        alt={movie.Title || 'movie'}
        onError={handleImageError}
        onLoad={handleImageLoad}
        onClick={() => onPosterClick(movie)}
        style={{ 
          display: imageLoaded ? 'block' : 'none'
        }}
      />
      {imageLoaded && (
        <div 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering poster click
            onFavoriteClick(movie);
          }}
          className='overlay d-flex align-items-center justify-content-center'
        >
          <FavoriteComponent />
        </div>
      )}
    </div>
  );
};

/**
 * Home component to display the list of movies from search results.
 * Filters out invalid movies and renders up to a specified number of movie cards.
 * @param {Object} props - Component props
 * @param {Array} props.movies - Array of movie objects to display
 * @param {Function} props.handleFavoritesClick - Function to handle adding/removing favorites
 * @param {React.Component} props.favoriteComponent - Component to render as favorite button
 */
const Home = ({ movies, handleFavoritesClick, favoriteComponent: FavoriteComponent }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Increased limit to show more movies (at least 5 rows of ~10 movies each)
  const MAX_POSTERS = 100;

  const handlePosterClick = (movie) => {
    setSelectedMovie(movie);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const validMovies = movies.filter(
    movie => hasValidPoster(movie) && hasValidTitle(movie)
  );
  
  const moviesToRender = validMovies.slice(0, Math.min(MAX_POSTERS, validMovies.length));

  return (
    <React.Fragment>
      {moviesToRender.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onPosterClick={handlePosterClick}
          onFavoriteClick={handleFavoritesClick}
          FavoriteComponent={FavoriteComponent}
        />
      ))}

      {openModal && selectedMovie && (
        <Modal
          movie={selectedMovie}
          handleCloseModal={handleCloseModal}
        />
      )}
    </React.Fragment>
  );
};

export default Home;

