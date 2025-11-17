import React from 'react';

/**
 * Heart icon component for adding to favorites.
 * Displays a filled red heart SVG icon.
 */
const HeartIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    className="bi bi-heart-fill"
    fill="red"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
    />
  </svg>
);

/**
 * AddToFavorites component renders in the overlay when a movie can be added to favorites.
 * Displays a red heart icon to indicate the add to favorites action.
 */
const AddToFavorites = () => {
  return (
    <React.Fragment>
      <span className="mr-2"> </span>
      <HeartIcon />
    </React.Fragment>
  );
};

export default AddToFavorites;

