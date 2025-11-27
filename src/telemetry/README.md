# Telemetry Test Feature - PBI-125

## Overview
This is a simple test feature designed to generate and track telemetry data for monitoring and analytics purposes.

## Features

### Core Functionality
- **Event Tracking**: Track various types of events with custom data
- **Session Management**: Automatic session ID generation and tracking
- **Performance Monitoring**: Track performance metrics
- **Error Tracking**: Capture and log errors with context
- **User Interaction Tracking**: Monitor user interactions with UI elements
- **Page View Tracking**: Track page navigation and views

### Data Management
- **Event Storage**: All events are stored in memory with timestamps
- **Event Filtering**: Filter events by name or type
- **Summary Statistics**: Get aggregated statistics about tracked events
- **Data Export**: Export telemetry data as JSON
- **Data Clearing**: Clear all tracked data

## Files

- `telemetry-test.js` - Main telemetry tracking module
- `telemetry-test.html` - Interactive demo page
- `README.md` - This documentation file

## Usage

### Basic Usage

```javascript
// Initialize telemetry
const telemetry = new TelemetryTest();

// Track a simple event
telemetry.trackEvent('button_click', {
  buttonId: 'submit-btn',
  userId: '12345'
});

// Track a page view
telemetry.trackPageView('Home Page', '/home');

// Track user interaction
telemetry.trackInteraction('search-box', 'focus');

// Track performance
telemetry.trackPerformance('api_response', 250, 'ms');

// Track an error
try {
  // Some code that might throw
} catch (error) {
  telemetry.trackError(error, 'data-processing');
}
```

### Retrieving Data

```javascript
// Get all events
const allEvents = telemetry.getEvents();

// Get events by name
const pageViews = telemetry.getEventsByName('page_view');

// Get summary statistics
const summary = telemetry.getSummary();
console.log('Total events:', summary.totalEvents);
console.log('Session duration:', summary.sessionDuration, 'ms');
console.log('Event counts:', summary.eventCounts);

// Export data
const jsonData = telemetry.exportData();
```

## Demo Page

Open `telemetry-test.html` in a web browser to see an interactive demonstration of the telemetry feature. The demo page includes:

- Buttons to trigger different types of telemetry events
- Real-time display of tracked events
- Summary statistics dashboard
- Data export and clear functionality

## API Reference

### Constructor
- `new TelemetryTest()` - Creates a new telemetry instance

### Methods

#### Event Tracking
- `trackEvent(eventName, eventData)` - Track a custom event
- `trackPageView(pageName, url)` - Track a page view
- `trackInteraction(elementId, action)` - Track user interaction
- `trackError(error, context)` - Track an error
- `trackPerformance(metricName, value, unit)` - Track a performance metric

#### Data Retrieval
- `getEvents()` - Get all tracked events
- `getEventsByName(eventName)` - Get events filtered by name
- `getSummary()` - Get summary statistics
- `exportData()` - Export data as JSON string

#### Utility
- `clear()` - Clear all telemetry data
- `generateSessionId()` - Generate a unique session ID

## Event Structure

Each tracked event has the following structure:

```javascript
{
  sessionId: "session_1234567890_abc123def",
  eventName: "page_view",
  timestamp: 1234567890123,
  duration: 5432,  // Time since session start
  data: {
    // Event-specific data
  }
}
```

## Acceptance Criteria

✅ Feature works - The telemetry system successfully:
- Tracks various types of events
- Stores event data with timestamps
- Provides summary statistics
- Allows data export and clearing
- Includes interactive demo page

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ⚠️ Requires polyfills for modern JavaScript features

## Future Enhancements

- Integration with backend analytics services
- Persistent storage (localStorage/IndexedDB)
- Real-time streaming to analytics endpoints
- Advanced filtering and querying capabilities
- Performance optimizations for high-volume tracking
- Event batching and throttling

## Testing

To test the feature:

1. Open `telemetry-test.html` in a web browser
2. Click the various tracking buttons
3. Observe events appearing in the output panel
4. Check that statistics update correctly
5. Test export and clear functionality
6. Verify all event types are tracked properly

## License

This feature is part of the main project and follows the same licensing terms.
