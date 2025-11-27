/**
 * Dark Mode Toggle Functionality
 * Handles theme switching between light and dark modes
 * Persists user preference in localStorage
 * PBI-126: Enhanced with telemetry tracking
 */

// Initialize theme toggle when DOM is ready
function initThemeToggle() {
  const toggleSwitch = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme on page load
  if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    toggleSwitch.classList.add('active');
    themeIcon.textContent = '🌙';
    themeText.textContent = 'Dark Mode';
    
    // PBI-126: Track theme loaded from localStorage
    if (window.telemetry) {
      window.telemetry.logEvent(window.TelemetryEventTypes.THEME_CHANGE, {
        theme: 'dark',
        source: 'localStorage',
        message: 'Dark mode loaded from saved preference'
      });
    }
  } else {
    // PBI-126: Track default light theme
    if (window.telemetry) {
      window.telemetry.logEvent(window.TelemetryEventTypes.THEME_CHANGE, {
        theme: 'light',
        source: 'default',
        message: 'Light mode loaded (default)'
      });
    }
  }
  
  // Toggle theme on switch click
  toggleSwitch.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const toggleStartTime = performance.now();
    
    if (currentTheme === 'dark') {
      // Switch to light mode
      htmlElement.setAttribute('data-theme', 'light');
      toggleSwitch.classList.remove('active');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      localStorage.setItem('theme', 'light');
      
      // PBI-126: Track theme change to light
      if (window.telemetry) {
        const toggleDuration = performance.now() - toggleStartTime;
        window.telemetry.trackThemeChange('light');
        window.telemetry.trackPerformance('theme_toggle', toggleDuration, 'ms');
        window.telemetry.trackInteraction('toggle', 'themeToggle', 'switched_to_light');
      }
    } else {
      // Switch to dark mode
      htmlElement.setAttribute('data-theme', 'dark');
      toggleSwitch.classList.add('active');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
      localStorage.setItem('theme', 'dark');
      
      // PBI-126: Track theme change to dark
      if (window.telemetry) {
        const toggleDuration = performance.now() - toggleStartTime;
        window.telemetry.trackThemeChange('dark');
        window.telemetry.trackPerformance('theme_toggle', toggleDuration, 'ms');
        window.telemetry.trackInteraction('toggle', 'themeToggle', 'switched_to_dark');
      }
    }
  });
  
  // PBI-126: Track theme toggle hover
  toggleSwitch.addEventListener('mouseenter', function() {
    if (window.telemetry) {
      window.telemetry.trackInteraction('toggle', 'themeToggle', 'hover');
    }
  });
}

// Call initThemeToggle when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
