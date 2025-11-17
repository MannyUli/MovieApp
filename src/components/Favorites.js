import React from 'react';
import Home from './Home';

/**
 * Favorites component displays the user's favorite movies.
 * Reuses the Home component to render favorite movies with remove functionality.
 * @param {Object} props - Component props
 * @param {Array} props.favorites - Array of favorite movie objects
 * @param {Function} props.handleFavoritesClick - Function to handle removing favorites
 * @param {React.Component} props.favoriteComponent - Component to render as favorite button (RemoveFavorites)
 */
const Favorites = ({ favorites, handleFavoritesClick, favoriteComponent }) => {
    return (
    <div className="row">
      <Home
        movies={favorites}
        handleFavoritesClick={handleFavoritesClick}
        favoriteComponent={favoriteComponent}
      />
     </div>
    );
};

export default Favorites; 