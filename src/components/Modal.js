import React, { useState, useEffect } from 'react';
import './Modal.css';

const API_KEY = '1190b3a6';
const API_URL = 'https://www.omdbapi.com';

/**
 * Close button component for the modal.
 * @param {Function} onClose - Callback function to close the modal
 */
const CloseButton = ({ onClose }) => (
  <span className="close" onClick={onClose}>&times;</span>
);

/**
 * Movie details section component.
 * @param {Object} movie - The movie object containing details
 * @param {Object} movieDetails - Detailed movie information from API (includes Plot)
 */
const MovieDetails = ({ movie, movieDetails }) => {
  // Use the Plot from detailed API response, or fallback to placeholder
  const description = movieDetails?.Plot || 'No description available.';
  const rating = movieDetails?.imdbRating;
  const totalSeasons = movieDetails?.totalSeasons;

    return (
    <>
                <h2 className="title text-muted">{movie.Title}</h2>
      <img src={movie.Poster} alt={movie.Title || 'Movie poster'} />
      <p className="description text-muted">{description}</p>
                <p className="type text-muted">Type: {movie.Type}</p>
      {totalSeasons && <p className="seasons text-muted">Seasons: {totalSeasons}</p>}
                <p className="date text-muted">Released: {movie.Year}</p>
      {rating && <p className="rating text-muted">Rating: {rating}</p>}
    </>
  );
};

/**
 * Modal content wrapper component.
 * @param {Object} movie - The movie object to display
 * @param {Object} movieDetails - Detailed movie information from API
 * @param {boolean} isLoading - Whether movie details are being fetched
 * @param {Function} onClose - Callback function to close the modal
 */
const ModalContent = ({ movie, movieDetails, isLoading, onClose }) => (
  <div className="modal-content">
    <CloseButton onClose={onClose} />
    {isLoading ? (
      <div className="text-center text-muted">
        <p>Loading movie details...</p>
            </div>
    ) : (
      <MovieDetails movie={movie} movieDetails={movieDetails} />
    )}
        </div>
);

/**
 * Modal component for displaying movie details.
 * Fetches detailed movie information (including Plot/description) from OMDB API.
 * @param {Object} props - Component props
 * @param {Object} props.movie - The movie object to display in the modal
 * @param {Function} props.handleCloseModal - Callback function to close the modal
 */
const Modal = ({ movie, handleCloseModal }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movie?.imdbID) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Use the detail endpoint (i=) to get full movie info including Plot
        const url = `${API_URL}/?i=${movie.imdbID}&apikey=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check for OMDB API errors
        if (data.Response === 'False') {
          const errorMsg = data.Error || 'Unknown API error';
          console.error(`OMDB API error fetching details for ${movie.imdbID}:`, errorMsg);
          // Still set movieDetails to null so UI can handle it
          setMovieDetails(null);
        } else if (data.Response === 'True') {
          setMovieDetails(data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie?.imdbID]);

  return (
    <div className="modal">
      <ModalContent 
        movie={movie} 
        movieDetails={movieDetails}
        isLoading={isLoading}
        onClose={handleCloseModal} 
      />
    </div>
  );
  };

export default Modal;
