# Dark Mode Toggle Application

A fully-featured dark mode toggle implementation with smooth transitions, persistent settings, and comprehensive component support.

## Features

### ✅ Core Requirements

- **Persistent Settings**: Dark mode preference is saved to localStorage and persists across browser sessions
- **Smooth Transitions**: All color changes include smooth CSS transitions (0.3s ease-in-out)
- **Universal Support**: All components (cards, buttons, modals, text) support both light and dark themes

### 🎨 Additional Features

- Modern, responsive design
- Accessible toggle switch with ARIA labels
- Settings modal with keyboard navigation (ESC to close)
- System preference detection as default
- Smooth animations for theme changes
- Color showcase demonstrating theme consistency

## File Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # CSS with theme variables and transitions
├── script.js           # Dark mode toggle logic
├── README.md           # This file
└── tests/
    └── test.html       # Manual testing page
```

## How It Works

### 1. Theme Persistence

The application uses localStorage to save user preferences:

```javascript
localStorage.setItem('darkModePreference', 'true');
```

On page load, the saved preference is retrieved and applied before the page renders, preventing flash of unstyled content.

### 2. Smooth Transitions

All theme-dependent properties include CSS transitions:

```css
transition: background-color 0.3s ease-in-out,
            color 0.3s ease-in-out;
```

### 3. Component Support

CSS custom properties (variables) ensure all components automatically adapt:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #212121;
}

[data-theme="dark"] {
    --bg-primary: #121212;
    --text-primary: #e0e0e0;
}
```

## Usage

### Basic Setup

1. Open `index.html` in a web browser
2. Click the settings icon in the header
3. Toggle the dark mode switch
4. Close the modal and observe the smooth transition
5. Refresh the page - your preference is saved!

### For Developers

#### Adding New Components

To ensure new components support dark mode:

1. Use CSS custom properties for colors:
   ```css
   .new-component {
       background-color: var(--card-bg);
       color: var(--text-primary);
   }
   ```

2. Add transition for smooth changes:
   ```css
   transition: background-color var(--transition-speed) var(--transition-timing);
   ```

#### Customizing Colors

Edit the CSS custom properties in `styles.css`:

```css
:root {
    /* Light mode */
    --bg-primary: #ffffff;
    /* ... */
}

[data-theme="dark"] {
    /* Dark mode */
    --bg-primary: #121212;
    /* ... */
}
```

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### Required Features

- CSS Custom Properties
- localStorage API
- data attributes
- matchMedia API (for system preference detection)

## Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support (Tab, Enter, ESC)
- ✅ Focus management in modal
- ✅ Sufficient color contrast in both themes
- ✅ Reduced motion support (respects user preferences)

## Testing

Open `tests/test.html` to verify:

1. Toggle switches between light and dark modes
2. Preference persists after page reload
3. All components transition smoothly
4. Modal opens and closes correctly
5. Keyboard navigation works

## Performance

- Zero runtime dependencies
- Minimal JavaScript (~150 lines)
- CSS-based animations for smooth 60fps transitions
- localStorage for instant preference retrieval

## License

MIT License - Feel free to use in your projects!

## Credits

Developed as part of the test_004 feature implementation.
