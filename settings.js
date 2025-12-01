/**
 * Settings Page JavaScript
 * Handles all settings page functionality including:
 * - Dark mode toggle in settings
 * - Auto theme detection
 * - Animations toggle
 * - Settings persistence
 * - Theme preview updates
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeSettings();
});

function initializeSettings() {
  // Get references to UI elements
  const autoThemeToggle = document.getElementById('autoThemeToggle');
  const animationsToggle = document.getElementById('animationsToggle');
  const saveButton = document.getElementById('saveSettings');
  const resetButton = document.getElementById('resetSettings');
  const themeStatus = document.getElementById('themeStatus');
  
  // Load saved settings
  loadSettings();
  
  // Update theme status display
  updateThemeStatus();
  
  // Set up event listeners
  if (autoThemeToggle) {
    autoThemeToggle.addEventListener('click', function() {
      toggleSetting(autoThemeToggle, 'autoTheme');
      if (autoThemeToggle.classList.contains('active')) {
        applySystemTheme();
      }
    });
  }
  
  if (animationsToggle) {
    animationsToggle.addEventListener('click', function() {
      toggleSetting(animationsToggle, 'animations');
      applyAnimationSettings();
    });
  }
  
  if (saveButton) {
    saveButton.addEventListener('click', saveAllSettings);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetToDefaults);
  }
  
  // Listen for theme changes from dark-mode.js
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      setTimeout(updateThemeStatus, 100);
    });
  }
  
  // Check for system theme preference changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addListener(handleSystemThemeChange);
  }
  
  // Track settings page load in telemetry
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.PAGE_LOAD, {
      page: 'settings',
      timestamp: new Date().toISOString()
    });
  }
}

function toggleSetting(toggleElement, settingName) {
  const isActive = toggleElement.classList.toggle('active');
  
  // Save to localStorage
  localStorage.setItem(settingName, isActive ? 'true' : 'false');
  
  // Track in telemetry
  if (window.telemetry) {
    window.telemetry.trackInteraction('toggle', settingName, isActive ? 'enabled' : 'disabled');
  }
  
  showMessage(`${settingName} ${isActive ? 'enabled' : 'disabled'}`, 'success');
}

function loadSettings() {
  // Load auto theme setting
  const autoTheme = localStorage.getItem('autoTheme') === 'true';
  const autoThemeToggle = document.getElementById('autoThemeToggle');
  if (autoThemeToggle && autoTheme) {
    autoThemeToggle.classList.add('active');
    applySystemTheme();
  }
  
  // Load animations setting
  const animations = localStorage.getItem('animations') !== 'false'; // Default true
  const animationsToggle = document.getElementById('animationsToggle');
  if (animationsToggle) {
    if (animations) {
      animationsToggle.classList.add('active');
    } else {
      animationsToggle.classList.remove('active');
    }
  }
  applyAnimationSettings();
}

function applySystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // System prefers dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeToggleUI('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    // System prefers light mode
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeToggleUI('light');
    localStorage.setItem('theme', 'light');
  }
  updateThemeStatus();
}

function handleSystemThemeChange(e) {
  const autoTheme = localStorage.getItem('autoTheme') === 'true';
  if (autoTheme) {
    applySystemTheme();
    showMessage('Theme updated to match system preference', 'success');
  }
}

function updateThemeToggleUI(theme) {
  const toggleSwitch = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  if (theme === 'dark') {
    if (toggleSwitch) toggleSwitch.classList.add('active');
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = 'Dark Mode';
  } else {
    if (toggleSwitch) toggleSwitch.classList.remove('active');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light Mode';
  }
}

function applyAnimationSettings() {
  const animations = localStorage.getItem('animations') !== 'false';
  if (animations) {
    document.body.style.setProperty('--animation-duration', '0.3s');
  } else {
    document.body.style.setProperty('--animation-duration', '0s');
  }
}

function updateThemeStatus() {
  const themeStatus = document.getElementById('themeStatus');
  if (themeStatus) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeName = currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
    themeStatus.textContent = `Current theme: ${themeName}`;
  }
}

function saveAllSettings() {
  // Settings are saved automatically on change, but this provides user feedback
  const settings = {
    theme: localStorage.getItem('theme') || 'light',
    autoTheme: localStorage.getItem('autoTheme') === 'true',
    animations: localStorage.getItem('animations') !== 'false'
  };
  
  // Track in telemetry
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.USER_INTERACTION, {
      action: 'save_settings',
      settings: settings,
      timestamp: new Date().toISOString()
    });
  }
  
  showMessage('Settings saved successfully!', 'success');
  
  console.log('Settings saved:', settings);
}

function resetToDefaults() {
  if (!confirm('Are you sure you want to reset all settings to defaults?')) {
    return;
  }
  
  // Reset to default values
  localStorage.setItem('theme', 'light');
  localStorage.setItem('autoTheme', 'false');
  localStorage.setItem('animations', 'true');
  
  // Apply light theme
  document.documentElement.setAttribute('data-theme', 'light');
  updateThemeToggleUI('light');
  
  // Reset toggle states
  const autoThemeToggle = document.getElementById('autoThemeToggle');
  const animationsToggle = document.getElementById('animationsToggle');
  
  if (autoThemeToggle) autoThemeToggle.classList.remove('active');
  if (animationsToggle) animationsToggle.classList.add('active');
  
  // Apply settings
  applyAnimationSettings();
  updateThemeStatus();
  
  // Track in telemetry
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.USER_INTERACTION, {
      action: 'reset_settings',
      timestamp: new Date().toISOString()
    });
  }
  
  showMessage('Settings reset to defaults', 'success');
}

function showMessage(text, type) {
  // Remove any existing message
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const message = document.createElement('div');
  message.className = `message message-${type}`;
  message.textContent = text;
  
  // Insert at top of settings container
  const container = document.querySelector('.settings-container');
  if (container) {
    container.insertBefore(message, container.firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeSettings,
    toggleSetting,
    loadSettings,
    applySystemTheme,
    updateThemeStatus,
    saveAllSettings,
    resetToDefaults
  };
}