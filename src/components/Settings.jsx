import React, { useState, useEffect } from 'react';
import './Settings.css';

/**
 * Settings Component
 * Provides a dark mode toggle for the application
 */
const Settings = () => {
  // Initialize dark mode state from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Apply dark mode to document root whenever it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting-item">
        <label htmlFor="dark-mode-toggle" className="setting-label">
          <span className="setting-name">Dark Mode</span>
          <span className="setting-description">
            Toggle between light and dark themes
          </span>
        </label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="dark-mode-toggle"
            checked={darkMode}
            onChange={handleToggle}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
