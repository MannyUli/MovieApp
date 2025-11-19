# MovieApp (Netflix 2.0)

MovieApp is a modern React experience inspired by the Netflix UI. It lets users browse movies, curate favourites, and even request AI-powered mood-based recommendations that surface the highest-rated titles. The project demonstrates clean component architecture, reusable hooks, and thoughtful UX touches such as sticky navigation, graceful image fallbacks, and interactive modals.

## 🎥 Demo Video

A quick 3-minute walkthrough of the app showing browsing, search, AI recommendations, and favorites.

[![Watch the Demo](https://img.youtube.com/vi/biF5F2LcBAQ/maxresdefault.jpg)](https://youtu.be/biF5F2LcBAQ)

Watch the demo on YouTube: [https://youtu.be/biF5F2LcBAQ](https://youtu.be/biF5F2LcBAQ)

## Features

- **Dynamic Search & Browse**: Instantly query the OMDb API as you type and render results with high-quality posters.
- **Genre-Based Home Page**: Browse curated sections including Action & Adventure, Comedy, and Animated Series with lazy-loaded content.
- **Separate Movies & Shows Pages**: Dedicated pages for movies-only and TV series-only browsing.
- **Favourites Management**: Persist favourite movies to local storage, add/remove with a single tap, and view them in a dedicated page.
- **AI Picks (Discover)**: Submit a mood or set of keywords and receive 3–5 top-rated suggestions (sorted by IMDb rating and vote count) with modal deep dives.
- **Smart Poster Validation**: Centralized validation system with localStorage caching to prevent broken images and improve performance.
- **Responsive UI**: Sticky navigation, floating AI prompt, modal details, and consistent card layouts tailored for desktop and mobile.
- **Comprehensive Testing**: Unit tests for components, hooks, and user interactions using React Testing Library.

## Tech Stack

- React 18 with functional components and hooks
- React Router v6 for client-side routing
- React Testing Library for comprehensive test coverage
- Bootstrap utility classes for foundational layout work
- Custom CSS modules for styling details
- OMDb API for movie data (HTTPS with robust error handling)
- Local Storage for persisting favorites and poster validation cache
- Intersection Observer API for lazy loading performance optimization

## Getting Started

```bash
# install dependencies
npm install

# run development server
npm start
```

The app runs at `http://localhost:3000`. API requests use the bundled OMDb demo key (`1190b3a6`). For production, replace it with your own key in:

- `src/components/AIChoice.js`
- `src/components/HomeLanding.js`
- `src/components/Modal.js`
- `src/hooks/useMovieSearch.js`
- `src/hooks/useShowSearch.js`

### Build & Deploy

```bash
npm run build
```

This creates an optimized build inside `build/`. Deploy it to any static hosting provider (Netlify, Vercel, GitHub Pages, etc.).

### Testing

```bash
npm test
```

Runs the CRA test runner in watch mode. The project includes comprehensive test coverage for:

- **Component Tests**: Navigation, Home, Favorites, Modal components
- **Hook Tests**: useMovieSearch, useFavorites with mocked API calls
- **User Interaction Tests**: Search input, favorites adding/removing, modal opening/closing
- **Edge Cases**: Empty states, error handling, localStorage failures, API errors

## Project Structure

```
movies/
├── src/
│   ├── components/
│   │   ├── AIChoice.js / AIChoice.css      # AI recommender UI and styles
│   │   ├── AIFloatButton.js / .css         # Floating shortcut to Discover
│   │   ├── Home.js / Home.css              # Shared movie grid with modal support
│   │   ├── HomeLanding.js / .css           # Genre-based home page with lazy loading
│   │   ├── MoviesOnly.js                   # Movies-only filtered view
│   │   ├── Shows.js / Shows.css            # TV series-only filtered view
│   │   ├── Favorites.js                    # Favourites page (reuses Home)
│   │   ├── Navigation.js                   # Sticky top navigation & search
│   │   ├── Modal.js / Modal.css            # Detail modal for movies/shows
│   │   ├── AddToFavorites.js               # Heart icon component
│   │   └── RemoveFavorites.js              # Remove icon component
│   ├── hooks/
│   │   ├── useMovieSearch.js               # Fetch & dedupe movie search results
│   │   ├── useShowSearch.js                # Fetch & dedupe TV series results
│   │   └── useFavorites.js                 # Local storage persistence
│   ├── utils/
│   │   └── validation.js                   # Poster/title validation with caching
│   ├── App.js / App.css                    # Root layout, routes, global styles
│   ├── App.test.js                         # Main app component tests
│   └── index.js                            # CRA entry point
└── public/
    └── index.html
```

## Cursor

[Cursor](https://cursor.sh/) (the AI pair-programmer) accelerated the build of this project by providing context-aware suggestions, quick refactors, and automated code edits.

### How Cursor Helped

- **AIChoice Enhancements**: Cursor assisted in wiring the AI recommendation flow (API orchestration, sorting by rating, modal integration) while ensuring React best practices.
- **UI Polish**: Generated consistent CSS tweaks (e.g., centering placeholders, creating the floating AI button) that match the project aesthetic.
- **Sticky Navigation Improvements**: Simplified the transition from a static navbar to a sticky wrapper plus floating shortcut by proposing the right structural changes in `App.js` and `App.css`.

### Example Changes

1. **AI Picks Sorting** – Cursor guided the update to fetch movie details, compute rating/vote metadata, and sort results so "most popular" truly means highest-rated.
2. **Modal Integration with AI Results** – Cursor provided the scaffold for reusing the existing `Modal` component, enabling deep detail views from AI suggestions without duplicating code.
3. **Floating Discover Button** – Cursor drafted the `AIFloatButton` component and corresponding CSS, creating a screen-floating entry point that follows the user while they scroll.
4. **Poster Validation & Caching** – Cursor helped create a centralized validation utility with localStorage caching to prevent broken images and improve performance across all components.
5. **Genre-Based Home Page** – Cursor assisted in building the `HomeLanding` component with lazy-loaded genre sections (Action & Adventure, Comedy, Animated Series) using Intersection Observer API.
6. **Separate Movies/Shows Pages** – Cursor helped create dedicated `MoviesOnly` and `Shows` components with filtered views for better content organization.
7. **Comprehensive Test Suite** – Cursor generated test files for components, hooks, user interactions, API integration, and edge cases, ensuring robust code quality.
8. **API Error Handling** – Cursor improved error handling across all API calls, including HTTPS migration and proper OMDB API error response handling.

Thanks to Cursor's quick iterations, the app evolved rapidly with fewer manual edits and better consistency across components.

## ⚡ Challenges & Solutions

1. **Broken Movie Posters & Inconsistent API Data**

Challenge: The OMDb API occasionally returned invalid poster URLs, causing broken images and inconsistent UI.

Solution: Created a centralized validation.js utility with localStorage caching to validate poster URLs and replace invalid images. This improved UI consistency, reduced redundant API calls, and enhanced performance across components.

2. **Slow Homepage Loading**

Challenge: Fetching all genre sections at once made the homepage sluggish and negatively impacted UX.

Solution: Implemented lazy loading using the Intersection Observer API, ensuring sections only load when visible, which drastically improved page performance.

3. **Persistent Favourites Without a Backend**

Challenge: Favourites would reset when navigating pages because state wasn't persisted.

Solution: Built a useFavorites hook backed by localStorage, allowing users to seamlessly add/remove favourites with one-click persistence across routes and sessions.

4. **Integrating AI Recommendations with Modal**

Challenge: AI-generated picks needed to display correctly in the existing modal workflow without duplicating UI components.

Solution: Normalized AI results to match the modal data structure, allowing the reuse of existing components while preserving a consistent, interactive experience.

5. **Comprehensive Testing of API-driven Components**

Challenge: Ensuring robust test coverage for hooks, components, and interactions, including edge cases like failed API calls or empty states.

Solution: Leveraged React Testing Library, writing unit and integration tests for components, hooks, user interactions, and API flows. Cursor assisted by scaffolding test files and generating coverage for edge cases.

6. **AI-Assisted Development Challenges**

Challenge: While working with Cursor as an AI pair programmer, I noticed workflow limitations:

- Occasionally it failed to add new files or include associated CSS files, causing incomplete styling.
- Undoing changes for multiple files could be inconsistent if previous edits spanned several files.
- When prompted to fix a single issue, it sometimes made unintended changes in other parts of the code.

Solution / Lesson Learned: I discovered that AI-assisted development works best one problem at a time. Breaking tasks into smaller, isolated steps ensures accuracy, easier undoing, and more predictable outcomes. I also developed strategies to quickly validate Cursor's suggestions and integrate them effectively, improving efficiency and my understanding of AI-assisted engineering workflows.

## Recent Updates

### Performance Improvements

- **Poster Caching System**: Implemented localStorage-based caching for validated poster URLs, reducing redundant API calls and improving load times.
- **Lazy Loading**: Added Intersection Observer API for genre sections on the home page, loading content only when visible.
- **Optimized API Calls**: Improved error handling and reduced unnecessary API requests with better validation logic.

### New Features

- **Genre Sections**: Home page now displays curated sections (Action & Adventure, Comedy, Animated Series) with 12+ movies per section.
- **Movies & Shows Pages**: Separate navigation pages for movies-only and TV series-only browsing.
- **Enhanced Modal**: Displays detailed movie information including plot, ratings, genres, directors, cast, and seasons (for TV shows).

### Code Quality

- **Centralized Validation**: Moved poster/title validation to `utils/validation.js` for consistency across components.
- **Test Coverage**: Added comprehensive test suite covering components, hooks, user interactions, and edge cases.
- **Error Handling**: Improved API error handling with proper HTTPS support and OMDB-specific error responses.
