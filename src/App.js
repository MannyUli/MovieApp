import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomeLanding from './components/HomeLanding';
import HomeList from './components/Home';
import MoviesOnly from './components/MoviesOnly';
import Shows from './components/Shows';
import AIChoice from './components/AIChoice';
import Favorites from './components/Favorites';
import AddToFavorites from './components/AddToFavorites';
import RemoveFavorites from './components/RemoveFavorites';
import AIFloatButton from './components/AIFloatButton';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useFavorites } from './hooks/useFavorites';

/**
 * Main App component that handles routing and state management.
 * Manages movie search and favorites functionality.
 */
const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const movies = useMovieSearch(searchValue);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (
    <Router>
      <div className='container-fluid movies'>
        <div className="sticky-nav-wrapper">
          <Navigation 
            searchValue={searchValue} 
            setSearchValue={setSearchValue} 
          />
        </div>

        <div className="row">
          <Routes>
            <Route 
              path='/' 
              element={
                <HomeLanding 
                  searchValue={searchValue}
                  movies={movies} 
                  handleFavoritesClick={addFavorite} 
                  favoriteComponent={AddToFavorites} 
                />
              } 
            />
            <Route 
              path='/movies' 
              element={
                <MoviesOnly 
                  movies={movies}
                  handleFavoritesClick={addFavorite}
                  favoriteComponent={AddToFavorites}
                />
              }
            />
            <Route 
              path='/shows' 
              element={
                <Shows 
                  searchValue={searchValue}
                  handleFavoritesClick={addFavorite} 
                  favoriteComponent={AddToFavorites} 
                />
              } 
            />
            <Route 
              path='/discover' 
              element={
                <AIChoice />
              } 
            />
            <Route 
              path='/favorites' 
              element={
                <Favorites 
                  favorites={favorites} 
                  handleFavoritesClick={removeFavorite} 
                  favoriteComponent={RemoveFavorites} 
                />
              } 
            />
          </Routes>
        </div>
        <AIFloatButton />
      </div>
    </Router>
  );
};

export default App;
