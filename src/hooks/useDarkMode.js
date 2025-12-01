import { useState, useEffect } from 'react';

/**
 * Custom hook for managing dark mode state
 * Handles localStorage persistence and DOM manipulation
 * 
 * @returns {[boolean, function]} Array containing darkMode state and toggle function
 */
const useDarkMode = () => {
  // Initialize state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Apply dark mode class to document root and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return [darkMode, toggleDarkMode];
};

export default useDarkMode;
