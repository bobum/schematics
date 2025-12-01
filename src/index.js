import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/theme.css';
import App from './App';

/**
 * Application Entry Point
 * Initializes React and renders the main App component
 */

// Initialize dark mode from localStorage on app load
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    document.documentElement.classList.add('dark-mode');
  }
};

// Apply dark mode immediately to prevent flash of wrong theme
initializeDarkMode();

// Render React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
