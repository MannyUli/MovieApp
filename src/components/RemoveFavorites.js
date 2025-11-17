import React from 'react';

/**
 * Remove icon component for removing from favorites.
 * Displays a white X icon with enhanced visibility.
 */
const RemoveIcon = () => (
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
    className="bi bi-x-square remove-icon"
    fill="white"
            xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.6))',
    }}
          >
            <path
      fillRule="evenodd"
      d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
);

/**
 * RemoveFavorites component renders in the overlay when a movie can be removed from favorites.
 * Displays an X icon to indicate the remove from favorites action.
 */
const RemoveFavorites = () => {
  return <RemoveIcon />;
};

export default RemoveFavorites;
