/**
 * Welcome Popup Script
 * Handles popup display, dismissal, and localStorage management
 */

(function() {
  'use strict';
  
  // Constants
  const STORAGE_KEY = 'welcomePopupSeen';
  const POPUP_VERSION = '1.0'; // Increment this if you want to show popup again to existing users
  
  /**
   * Check if user has already seen the welcome popup
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
   * Mark popup as seen in localStorage
   */
  function markPopupAsSeen() {
    try {
      localStorage.setItem(STORAGE_KEY, POPUP_VERSION);
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }
  
  /**
   * Create the popup HTML structure
   */
  function createPopupHTML() {
    return `
      <div class="welcome-overlay" id="welcomeOverlay">
        <div class="welcome-popup">
          <button class="welcome-close" id="welcomeClose" aria-label="Close welcome popup">
            ×
          </button>
          
          <div class="welcome-header">
            <div class="welcome-icon">👋</div>
            <h2>Welcome!</h2>
            <p>To Visual Connection Schematics</p>
          </div>
          
          <div class="welcome-body">
            <h3>🚀 Get Started</h3>
            <p>This interactive tool helps you visualize and understand electrical connection schematics with ease.</p>
            
            <ul class="welcome-features">
              <li>
                <div class="feature-icon">🔌</div>
                <span><strong>Interactive Diagrams:</strong> Explore component connections visually</span>
              </li>
              <li>
                <div class="feature-icon">🎨</div>
                <span><strong>Dark Mode:</strong> Toggle between light and dark themes</span>
              </li>
              <li>
                <div class="feature-icon">📊</div>
                <span><strong>Connection Stats:</strong> View detailed wire and connection information</span>
              </li>
              <li>
                <div class="feature-icon">✨</div>
                <span><strong>Modern Design:</strong> Clean, responsive interface for all devices</span>
              </li>
            </ul>
            
            <button class="welcome-button" id="welcomeButton">
              Let's Go! 🎯
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Close the popup with animation
   */
  function closePopup() {
    const overlay = document.getElementById('welcomeOverlay');
    if (overlay) {
      overlay.classList.add('closing');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        overlay.remove();
      }, 300);
      
      // Mark as seen
      markPopupAsSeen();
    }
  }
  
  /**
   * Initialize the popup
   */
  function initWelcomePopup() {
    // Check if user has already seen the popup
    if (hasSeenPopup()) {
      console.log('Welcome popup already seen by user');
      return;
    }
    
    // Create and inject popup HTML
    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = createPopupHTML();
    document.body.appendChild(popupContainer.firstElementChild);
    
    // Add event listeners
    const closeButton = document.getElementById('welcomeClose');
    const actionButton = document.getElementById('welcomeButton');
    const overlay = document.getElementById('welcomeOverlay');
    
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }
    
    if (actionButton) {
      actionButton.addEventListener('click', closePopup);
    }
    
    // Close on overlay click (outside popup)
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closePopup();
        }
      });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('welcomeOverlay');
        if (overlay) {
          closePopup();
        }
      }
    });
    
    console.log('Welcome popup initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWelcomePopup);
  } else {
    // DOM already loaded
    initWelcomePopup();
  }
  
  // Expose function to reset popup for testing purposes
  window.resetWelcomePopup = function() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Welcome popup reset. Reload the page to see it again.');
    } catch (e) {
      console.error('Could not reset popup:', e);
    }
  };
  
})();