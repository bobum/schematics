/**
 * Dark Mode Toggle Application
 * 
 * This script handles:
 * - Dark mode toggle functionality
 * - Persistence using localStorage
 * - Smooth transitions between themes
 * - Modal settings dialog
 */

class DarkModeToggle {
    constructor() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeModal = document.getElementById('closeModal');
        this.STORAGE_KEY = 'darkModePreference';
        
        this.init();
    }

    /**
     * Initialize the dark mode toggle
     */
    init() {
        // Load saved preference
        this.loadPreference();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Apply initial theme
        this.updateToggleState();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Dark mode toggle
        this.darkModeToggle.addEventListener('change', () => {
            this.toggleDarkMode();
        });

        // Settings button
        this.settingsBtn.addEventListener('click', () => {
            this.openModal();
        });

        // Close modal button
        this.closeModal.addEventListener('click', () => {
            this.closeModalDialog();
        });

        // Close modal when clicking outside
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeModalDialog();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('active')) {
                this.closeModalDialog();
            }
        });
    }

    /**
     * Load dark mode preference from localStorage
     */
    loadPreference() {
        const savedPreference = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedPreference !== null) {
            // Use saved preference
            const isDarkMode = savedPreference === 'true';
            this.setTheme(isDarkMode);
        } else {
            // Check system preference
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDarkMode);
        }
    }

    /**
     * Save dark mode preference to localStorage
     * @param {boolean} isDarkMode - Whether dark mode is enabled
     */
    savePreference(isDarkMode) {
        localStorage.setItem(this.STORAGE_KEY, isDarkMode.toString());
        console.log(`Dark mode preference saved: ${isDarkMode}`);
    }

    /**
     * Set the theme
     * @param {boolean} isDarkMode - Whether to enable dark mode
     */
    setTheme(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        this.updateToggleState();
    }

    /**
     * Update the toggle switch state
     */
    updateToggleState() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        this.darkModeToggle.checked = isDarkMode;
    }

    /**
     * Toggle dark mode on/off
     */
    toggleDarkMode() {
        const isDarkMode = this.darkModeToggle.checked;
        
        // Apply theme with transition
        this.setTheme(isDarkMode);
        
        // Save preference
        this.savePreference(isDarkMode);
        
        // Add a subtle animation effect
        this.animateThemeChange();
    }

    /**
     * Add animation effect when theme changes
     */
    animateThemeChange() {
        // Add a class to trigger any additional animations
        document.body.classList.add('theme-changing');
        
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
    }

    /**
     * Open the settings modal
     */
    openModal() {
        this.settingsModal.classList.add('active');
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Focus on the toggle for accessibility
        setTimeout(() => {
            this.darkModeToggle.focus();
        }, 100);
    }

    /**
     * Close the settings modal
     */
    closeModalDialog() {
        this.settingsModal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to settings button
        this.settingsBtn.focus();
    }
}

// Initialize the dark mode toggle when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DarkModeToggle();
    });
} else {
    new DarkModeToggle();
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-update if user hasn't set a preference
    if (localStorage.getItem('darkModePreference') === null) {
        const darkModeToggle = new DarkModeToggle();
        darkModeToggle.setTheme(e.matches);
    }
});