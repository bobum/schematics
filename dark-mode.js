/**
 * Dark Mode Toggle Functionality
 * Handles theme switching between light and dark modes
 * Persists user preference in localStorage
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
  }
  
  // Toggle theme on switch click
  toggleSwitch.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      // Switch to light mode
      htmlElement.setAttribute('data-theme', 'light');
      toggleSwitch.classList.remove('active');
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Light Mode';
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      htmlElement.setAttribute('data-theme', 'dark');
      toggleSwitch.classList.add('active');
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Dark Mode';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// Call initThemeToggle when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
