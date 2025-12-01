# Dark Mode Toggle Feature

## Overview
A complete implementation of a dark mode toggle feature with persistent user preferences, smooth transitions, and accessibility support.

## Features

✅ **Dark Mode Toggle** - Easy-to-use toggle switch in settings  
✅ **Persistent Preferences** - User choice saved in localStorage  
✅ **Smooth Transitions** - Animated theme switching  
✅ **Accessible** - Keyboard navigation and screen reader support  
✅ **Reusable Hook** - Custom `useDarkMode` React hook  
✅ **CSS Variables** - Theme customization with CSS custom properties  
✅ **Fully Tested** - Unit tests included  
✅ **Well Documented** - Comprehensive documentation  

## Installation

### Prerequisites
- Node.js 14+
- React 16.8+ (for hooks support)
- Modern browser with localStorage support

### Setup
```bash
# Install dependencies (if needed)
npm install

# Start development server
npm start
```

## Project Structure

```
src/
├── components/
│   ├── Settings.jsx              # Main settings component
│   ├── Settings.css              # Settings styles
│   └── __tests__/
│       └── Settings.test.jsx     # Component tests
├── hooks/
│   └── useDarkMode.js            # Custom dark mode hook
├── styles/
│   └── theme.css                 # Global theme variables
├── App.js                        # Main application
└── App.css                       # App styles

docs/
└── DARK_MODE_IMPLEMENTATION.md   # Detailed implementation guide

README.md                         # This file
```

## Usage

### Basic Implementation

1. **Import the Settings component:**
```jsx
import Settings from './components/Settings';
import './styles/theme.css';

function App() {
  return (
    <div className="App">
      <Settings />
    </div>
  );
}
```

2. **Or use the custom hook:**
```jsx
import useDarkMode from './hooks/useDarkMode';

function MyComponent() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

### Theme Customization

Edit `src/styles/theme.css` to customize colors:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  /* ... more variables */
}

:root.dark-mode {
  --bg-primary: #1e1e1e;
  --text-primary: #e0e0e0;
  /* ... dark mode variables */
}
```

## Components

### Settings Component

The main UI component for dark mode settings.

**Props:** None

**Features:**
- Toggle switch UI
- Automatic localStorage persistence
- Applies theme to document root

### useDarkMode Hook

Custom React hook for dark mode state management.

**Returns:** `[darkMode: boolean, toggleDarkMode: function]`

**Example:**
```jsx
const [darkMode, toggleDarkMode] = useDarkMode();
```

## Styling

### CSS Custom Properties

The theme system uses CSS custom properties for easy theming:

| Variable | Light Mode | Dark Mode |
|----------|------------|------------|
| `--bg-primary` | #ffffff | #1e1e1e |
| `--bg-secondary` | #f5f5f5 | #2d2d2d |
| `--text-primary` | #333333 | #e0e0e0 |
| `--text-secondary` | #666666 | #b0b0b0 |
| `--accent-color` | #4CAF50 | #66BB6A |

### Transitions

All theme changes include smooth 0.3s ease transitions for:
- Background colors
- Text colors
- Border colors
- Box shadows

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Component rendering
- Toggle functionality
- localStorage persistence
- DOM class manipulation
- Initial state loading

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

### Features
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ WCAG AA color contrast

### Keyboard Shortcuts
- `Tab` - Navigate to toggle
- `Space` / `Enter` - Toggle dark mode

## Performance

- **Fast:** Theme changes are instant
- **Optimized:** Uses CSS custom properties
- **Efficient:** Minimal re-renders with React hooks
- **Persistent:** localStorage for cross-session memory

## API Reference

### Settings Component

```jsx
<Settings />
```

No props required. Self-contained component with internal state management.

### useDarkMode Hook

```javascript
const [darkMode, toggleDarkMode] = useDarkMode();
```

**Returns:**
- `darkMode` (boolean): Current dark mode state
- `toggleDarkMode` (function): Function to toggle dark mode

## Configuration

### localStorage Key

The dark mode preference is stored under the key `'darkMode'`:
- `'true'` - Dark mode enabled
- `'false'` - Light mode enabled

### CSS Class

Dark mode is activated by adding `'dark-mode'` class to `document.documentElement`.

## Troubleshooting

### Theme not persisting
- Check localStorage is enabled
- Verify no browser extensions blocking storage

### Styles not updating
- Ensure theme.css is imported
- Check CSS custom properties are defined
- Verify browser supports CSS custom properties

### Toggle not working
- Check console for JavaScript errors
- Verify React version supports hooks
- Ensure component is properly mounted

## Future Enhancements

- [ ] System theme detection (`prefers-color-scheme`)
- [ ] Additional theme options (high contrast, etc.)
- [ ] Scheduled theme switching
- [ ] Theme preview
- [ ] Custom color picker
- [ ] Export/import theme settings

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## License

MIT License - feel free to use in your projects!

## Support

For issues or questions:
- Check the documentation
- Review existing issues
- Create a new issue with details

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Settings component with toggle
- ✅ Custom useDarkMode hook
- ✅ Global theme system
- ✅ localStorage persistence
- ✅ Smooth transitions
- ✅ Accessibility features
- ✅ Unit tests
- ✅ Complete documentation

## Credits

Developed as part of the test_004 feature implementation.

---

**Ready to use!** Import the Settings component and start using dark mode in your application.
