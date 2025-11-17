import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation with Streamer brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/streamer/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/movies/i)).toBeInTheDocument();
  expect(screen.getByText(/shows/i)).toBeInTheDocument();
  expect(screen.getByText(/favorites/i)).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/type to search/i);
  expect(searchInput).toBeInTheDocument();
});
