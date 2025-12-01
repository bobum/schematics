/**
 * Settings Page JavaScript
 * Dark Mode Toggle Implementation - test_004
 * Comprehensive settings management with localStorage persistence
 */

(function() {
  'use strict';
  
  // Settings configuration
  const SETTINGS_KEY = 'app_settings';
  
  // Default settings
  const defaultSettings = {
    theme: 'light',
    autoTheme: false,
    animations: true,
    highContrast: false,
    telemetry: true
  };
  
  // Current settings (loaded from localStorage or defaults)
  let currentSettings = { ...defaultSettings };
  
  /**
   * Initialize settings page
   */
  function initSettings() {
    // Load saved settings
    loadSettings();
    
    // Apply current settings to UI
    applySettingsToUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Track page load
    if (window.telemetry) {
      window.telemetry.logEvent(window.TelemetryEventTypes.PAGE_LOAD, {
        page: 'settings',
        message: 'Settings page loaded'
      });
    }
    
    console.log('[Settings] Settings page initialized');
    console.log('[Settings] Current settings:', currentSettings);
  }
  
  /**
   * Load settings from localStorage
   */
  function loadSettings() {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        currentSettings = { ...defaultSettings, ...JSON.parse(savedSettings) };
        console.log('[Settings] Loaded settings from localStorage');
      } else {
        console.log('[Settings] No saved settings found, using defaults');
      }
    } catch (error) {
      console.error('[Settings] Error loading settings:', error);
      currentSettings = { ...defaultSettings };
    }
  }
  
  /**
   * Save settings to localStorage
   */
  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
      
      // Also save theme separately for backward compatibility
      localStorage.setItem('theme', currentSettings.theme);
      
      console.log('[Settings] Settings saved successfully');
      
      // Track save event
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.logEvent(window.TelemetryEventTypes.CUSTOM, {
          eventName: 'settings_saved',
          settings: currentSettings
        });
      }
      
      return true;
    } catch (error) {
      console.error('[Settings] Error saving settings:', error);
      return false;
    }
  }
  
  /**
   * Apply settings to UI elements
   */
  function applySettingsToUI() {
    // Apply theme
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', currentSettings.theme);
    
    // Update theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeSettingIcon');
    const themeStatusBadge = document.getElementById('themeStatusBadge');
    
    if (currentSettings.theme === 'dark') {
      themeToggle.classList.add('active');
      themeIcon.textContent = '🌙';
      themeStatusBadge.textContent = 'Dark Mode Active';
    } else {
      themeToggle.classList.remove('active');
      themeIcon.textContent = '☀️';
      themeStatusBadge.textContent = 'Light Mode Active';
    }
    
    // Update auto theme toggle
    const autoThemeToggle = document.getElementById('autoThemeToggle');
    if (currentSettings.autoTheme) {
      autoThemeToggle.classList.add('active');
    } else {
      autoThemeToggle.classList.remove('active');
    }
    
    // Update animations toggle
    const animationsToggle = document.getElementById('animationsToggle');
    if (currentSettings.animations) {
      animationsToggle.classList.add('active');
    } else {
      animationsToggle.classList.remove('active');
      document.body.classList.add('no-animations');
    }
    
    // Update contrast toggle
    const contrastToggle = document.getElementById('contrastToggle');
    if (currentSettings.highContrast) {
      contrastToggle.classList.add('active');
      document.body.classList.add('high-contrast');
    } else {
      contrastToggle.classList.remove('active');
      document.body.classList.remove('high-contrast');
    }
    
    // Update telemetry toggle
    const telemetryToggle = document.getElementById('telemetryToggle');
    if (currentSettings.telemetry) {
      telemetryToggle.classList.add('active');
    } else {
      telemetryToggle.classList.remove('active');
    }
  }
  
  /**
   * Setup event listeners for all settings controls
   */
  function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
      const newTheme = currentSettings.theme === 'dark' ? 'light' : 'dark';
      currentSettings.theme = newTheme;
      applySettingsToUI();
      saveSettings();
      
      // Track theme change
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.trackThemeChange(newTheme);
        window.telemetry.trackInteraction('toggle', 'themeToggle', 'theme_changed_to_' + newTheme);
      }
      
      showMessage('Theme changed to ' + (newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'), 'success');
    });
    
    // Auto theme toggle
    const autoThemeToggle = document.getElementById('autoThemeToggle');
    autoThemeToggle.addEventListener('click', function() {
      currentSettings.autoTheme = !currentSettings.autoTheme;
      applySettingsToUI();
      saveSettings();
      
      if (currentSettings.autoTheme) {
        startAutoTheme();
        showMessage('Auto theme enabled', 'info');
      } else {
        stopAutoTheme();
        showMessage('Auto theme disabled', 'info');
      }
      
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.trackInteraction('toggle', 'autoThemeToggle', currentSettings.autoTheme ? 'enabled' : 'disabled');
      }
    });
    
    // Animations toggle
    const animationsToggle = document.getElementById('animationsToggle');
    animationsToggle.addEventListener('click', function() {
      currentSettings.animations = !currentSettings.animations;
      applySettingsToUI();
      saveSettings();
      showMessage('Animations ' + (currentSettings.animations ? 'enabled' : 'disabled'), 'info');
      
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.trackInteraction('toggle', 'animationsToggle', currentSettings.animations ? 'enabled' : 'disabled');
      }
    });
    
    // High contrast toggle
    const contrastToggle = document.getElementById('contrastToggle');
    contrastToggle.addEventListener('click', function() {
      currentSettings.highContrast = !currentSettings.highContrast;
      applySettingsToUI();
      saveSettings();
      showMessage('High contrast ' + (currentSettings.highContrast ? 'enabled' : 'disabled'), 'info');
      
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.trackInteraction('toggle', 'contrastToggle', currentSettings.highContrast ? 'enabled' : 'disabled');
      }
    });
    
    // Telemetry toggle
    const telemetryToggle = document.getElementById('telemetryToggle');
    telemetryToggle.addEventListener('click', function() {
      currentSettings.telemetry = !currentSettings.telemetry;
      applySettingsToUI();
      saveSettings();
      showMessage('Analytics ' + (currentSettings.telemetry ? 'enabled' : 'disabled'), 'info');
    });
    
    // Save button
    const saveButton = document.getElementById('saveSettings');
    saveButton.addEventListener('click', function() {
      if (saveSettings()) {
        showMessage('Settings saved successfully!', 'success');
      } else {
        showMessage('Error saving settings', 'error');
      }
      
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.trackInteraction('button', 'saveSettings', 'clicked');
      }
    });
    
    // Reset button
    const resetButton = document.getElementById('resetSettings');
    resetButton.addEventListener('click', function() {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        currentSettings = { ...defaultSettings };
        applySettingsToUI();
        saveSettings();
        showMessage('Settings reset to defaults', 'info');
        
        if (window.telemetry) {
          window.telemetry.trackInteraction('button', 'resetSettings', 'clicked');
        }
      }
    });
    
    // Clear data button
    const clearButton = document.getElementById('clearData');
    clearButton.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        sessionStorage.clear();
        showMessage('All data cleared', 'info');
        
        if (window.telemetry) {
          window.telemetry.trackInteraction('button', 'clearData', 'clicked');
        }
        
        // Reload page after a short delay
        setTimeout(function() {
          location.reload();
        }, 1500);
      }
    });
  }
  
  /**
   * Auto theme functionality based on time of day
   */
  let autoThemeInterval = null;
  
  function startAutoTheme() {
    // Check time immediately
    updateAutoTheme();
    
    // Then check every minute
    autoThemeInterval = setInterval(updateAutoTheme, 60000);
  }
  
  function stopAutoTheme() {
    if (autoThemeInterval) {
      clearInterval(autoThemeInterval);
      autoThemeInterval = null;
    }
  }
  
  function updateAutoTheme() {
    const hour = new Date().getHours();
    // Dark mode from 6 PM to 6 AM
    const shouldBeDark = hour >= 18 || hour < 6;
    const newTheme = shouldBeDark ? 'dark' : 'light';
    
    if (currentSettings.theme !== newTheme) {
      currentSettings.theme = newTheme;
      applySettingsToUI();
      saveSettings();
      
      if (window.telemetry && currentSettings.telemetry) {
        window.telemetry.logEvent(window.TelemetryEventTypes.THEME_CHANGE, {
          theme: newTheme,
          source: 'auto_theme',
          message: 'Theme automatically changed based on time'
        });
      }
    }
  }
  
  /**
   * Show temporary message banner
   */
  function showMessage(message, type = 'info') {
    // Remove existing message if any
    const existing = document.querySelector('.message-banner');
    if (existing) {
      existing.remove();
    }
    
    // Create message banner
    const banner = document.createElement('div');
    banner.className = `message-banner ${type}`;
    
    const iconMap = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    
    banner.innerHTML = `
      <span class="message-icon">${iconMap[type] || 'ℹ️'}</span>
      <span class="message-text">${message}</span>
    `;
    
    document.body.appendChild(banner);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(100%)';
      setTimeout(function() {
        banner.remove();
      }, 300);
    }, 3000);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }
  
  // Start auto theme if enabled
  if (currentSettings.autoTheme) {
    startAutoTheme();
  }
  
})();
