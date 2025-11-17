import React from 'react';
import Home from './Home';

/**
 * MoviesOnly renders only search results that are of type "movie".
 * It reuses the Home component so we keep poster validation, modal support,
 * and favourites behaviour consistent with the rest of the app.
 */
const MoviesOnly = ({ movies = [], handleFavoritesClick, favoriteComponent }) => {
  const movieOnlyList = movies.filter((movie) => movie?.Type?.toLowerCase() === 'movie');

  return (
    <Home
      movies={movieOnlyList}
      handleFavoritesClick={handleFavoritesClick}
      favoriteComponent={favoriteComponent}
    />
  );
};

export default MoviesOnly;
