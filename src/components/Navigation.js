import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

/**
 * Search input component for movie search.
 * @param {Object} props - Component props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Callback function when input value changes
 */
const SearchInput = ({ value, onChange }) => (
  <input
    className="form-control"
    type="text"
    value={value}
    onChange={onChange}
    placeholder="Type to search..."
  />
);

/**
 * Navigation links component.
 * Renders navigation links for Home, Movies, Shows, and Favorites pages.
 */
const NavLinks = () => (
  <>
    <Link to="/" className="nav-item nav-link">
      Home
    </Link>
    <Link to="/movies" className="nav-item nav-link">
      Movies
    </Link>
    <Link to="/shows" className="nav-item nav-link">
      Shows
    </Link>
    <Link to="/favorites" className="nav-item nav-link">
      Favorites
    </Link>
  </>
);

/**
 * Navigation component containing brand, links, and search input.
 * @param {Object} props - Component props
 * @param {string} props.searchValue - Current search input value
 * @param {Function} props.setSearchValue - Function to update search value
 */
const Navigation = ({ searchValue, setSearchValue }) => {
  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <nav className="nav nav-pills nav-justified sticky-nav">
      <Link to="/" className="navbar-brand">Streamer</Link>
      <NavLinks />
      <SearchInput value={searchValue} onChange={handleChange} />
    </nav>
  );
};

export default Navigation;
