/**
 * Welcome Popup Script
 * Displays a welcome message to first-time visitors
 * Uses localStorage to remember if user has seen the popup
 */

(function() {
  'use strict';
  
  // Configuration
  const STORAGE_KEY = 'welcomePopupSeen';
  const POPUP_VERSION = '1.0'; // Change this to show popup again after updates
  
  /**
   * Check if user has already seen the popup
   */
  function hasSeenPopup() {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      return seen === POPUP_VERSION;
    } catch (e) {
      console.warn('localStorage not available:', e);
      return false;
    }
  }
  
  /**
   * Mark popup as seen
   */
  function markPopupAsSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, POPUP_VERSION);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }
  
  /**
   * Create the popup HTML
   */
  function createPopupHTML() {
    return `
      <div class="welcome-popup-overlay" id="welcomePopupOverlay">
        <div class="welcome-popup" id="welcomePopup">
          <button class="welcome-popup-close" id="welcomePopupClose" aria-label="Close popup">&times;</button>
          
          <div class="welcome-popup-header">
            <div class="welcome-popup-icon">🔌</div>
            <h2 class="welcome-popup-title">Welcome!</h2>
            <p class="welcome-popup-subtitle">Connection Schematics Visualization</p>
          </div>
          
          <div class="welcome-popup-content">
            <p>Hello and welcome to our Visual Connection Schematics tool! We're excited to have you here.</p>
            <ul>
              <li>Visualize complex component connections</li>
              <li>Track wire connections and pin mappings</li>
              <li>Toggle between light and dark themes</li>
              <li>Get real-time connection statistics</li>
            </ul>
            <p>Explore the interface and discover how easy it is to understand your connection schematics!</p>
          </div>
          
          <div class="welcome-popup-footer">
            <button class="welcome-popup-button" id="welcomePopupButton">Get Started</button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Close the popup with animation
   */
  function closePopup() {
    const overlay = document.getElementById('welcomePopupOverlay');
    if (overlay) {
      // Add fade out animation
      overlay.style.animation = 'fadeInOverlay 0.3s ease reverse';
      
      setTimeout(() => {
        overlay.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
          overlay.remove();
        }, 100);
      }, 300);
      
      // Mark as seen
      markPopupAsSeen();
    }
  }
  
  /**
   * Show the popup
   */
  function showPopup() {
    // Create and inject the popup HTML
    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = createPopupHTML();
    document.body.appendChild(popupContainer.firstElementChild);
    
    // Add event listeners
    const closeButton = document.getElementById('welcomePopupClose');
    const mainButton = document.getElementById('welcomePopupButton');
    const overlay = document.getElementById('welcomePopupOverlay');
    
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }
    
    if (mainButton) {
      mainButton.addEventListener('click', closePopup);
    }
    
    // Close when clicking outside the popup
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closePopup();
        }
      });
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', escapeHandler);
      }
    });
  }
  
  /**
   * Initialize the popup on page load
   */
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        if (!hasSeenPopup()) {
          // Small delay to let page render first
          setTimeout(showPopup, 500);
        }
      });
    } else {
      // DOM already loaded
      if (!hasSeenPopup()) {
        setTimeout(showPopup, 500);
      }
    }
  }
  
  // Start the initialization
  init();
  
  // Expose function to manually show popup (for testing/debugging)
  window.showWelcomePopup = function() {
    showPopup();
  };
  
  // Expose function to reset popup state (for testing/debugging)
  window.resetWelcomePopup = function() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Welcome popup state reset. Refresh page to see it again.');
    } catch (e) {
      console.warn('Could not reset popup state:', e);
    }
  };
  
})();