import React, { useState } from 'react';
import Modal from './Modal';
import { useShowSearch } from '../hooks/useShowSearch';
import { hasValidPoster, hasValidTitle, cacheValidPoster } from '../utils/validation';

/**
 * ShowCard component for rendering individual TV show poster cards.
 * Handles image loading errors and hides cards with broken images.
 * @param {Object} show - The show object containing poster and title information
 * @param {Function} onPosterClick - Callback function when poster is clicked
 * @param {Function} onFavoriteClick - Callback function when favorite button is clicked
 * @param {React.Component} FavoriteComponent - Component to render as favorite button
 */
const ShowCard = ({ show, onPosterClick, onFavoriteClick, FavoriteComponent }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Cache the poster URL when image loads successfully
    if (show.Poster) {
      cacheValidPoster(show.Poster);
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
        src={show.Poster} 
        alt={show.Title || 'TV show'}
        onError={handleImageError}
        onLoad={handleImageLoad}
        onClick={() => onPosterClick(show)}
        style={{ 
          display: imageLoaded ? 'block' : 'none'
        }}
      />
      {imageLoaded && (
        <div 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering poster click
            onFavoriteClick(show);
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
 * Shows component to display the list of TV shows from search results.
 * Filters out invalid shows and renders up to a specified number of show cards.
 * Uses the same layout as the Home component.
 * @param {Object} props - Component props
 * @param {string} props.searchValue - Current search value from navigation
 * @param {Function} props.handleFavoritesClick - Function to handle adding/removing favorites
 * @param {React.Component} props.favoriteComponent - Component to render as favorite button
 */
const Shows = ({ searchValue, handleFavoritesClick, favoriteComponent: FavoriteComponent }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const MAX_POSTERS = 100;
  
  // Use the show search hook to fetch shows
  const shows = useShowSearch(searchValue);

  const handlePosterClick = (show) => {
    setSelectedShow(show);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const validShows = shows.filter(
    show => hasValidPoster(show) && hasValidTitle(show)
  );
  
  const showsToRender = validShows.slice(0, Math.min(MAX_POSTERS, validShows.length));

  return (
    <React.Fragment>
      {showsToRender.map((show) => (
        <ShowCard
          key={show.imdbID}
          show={show}
          onPosterClick={handlePosterClick}
          onFavoriteClick={handleFavoritesClick}
          FavoriteComponent={FavoriteComponent}
        />
      ))}

      {openModal && selectedShow && (
        <Modal
          movie={selectedShow}
          handleCloseModal={handleCloseModal}
        />
      )}
    </React.Fragment>
  );
};

export default Shows;
