# Telemetry Test Feature Integration Guide

## PBI-125: Simple Test Feature to Generate Telemetry Data

This guide explains how to integrate the telemetry test feature into your application.

## Quick Start

### 1. Include the Required Files

```html
<!-- Include the main telemetry module -->
<script src="src/telemetry/telemetry-test.js"></script>

<!-- Optional: Include configuration -->
<script src="src/telemetry/config.js"></script>
```

### 2. Initialize Telemetry

```javascript
// Create a global telemetry instance
const telemetry = new TelemetryTest();

// Track initial page load
telemetry.trackPageView('Application Start', window.location.href);
```

### 3. Track Events

```javascript
// Track user interactions
document.getElementById('myButton').addEventListener('click', () => {
  telemetry.trackInteraction('myButton', 'click');
});

// Track custom events
telemetry.trackEvent('feature_used', {
  featureName: 'search',
  searchTerm: 'example'
});
```

## Integration Patterns

### Pattern 1: Global Instance

```javascript
// Initialize once in your main application file
window.appTelemetry = new TelemetryTest();

// Use anywhere in your application
function handleAction() {
  window.appTelemetry.trackEvent('action_performed');
}
```

### Pattern 2: Module-based

```javascript
// telemetry-service.js
import TelemetryTest from './telemetry-test';

class TelemetryService {
  constructor() {
    this.telemetry = new TelemetryTest();
  }

  trackUserAction(action, data) {
    return this.telemetry.trackEvent('user_action', {
      action,
      ...data
    });
  }

  trackError(error, context) {
    return this.telemetry.trackError(error, context);
  }
}

export default new TelemetryService();
```

### Pattern 3: React Integration

```javascript
// useTelemetry.js
import { useEffect } from 'react';
import { telemetry } from './telemetry-instance';

export function useTelemetry() {
  return {
    trackEvent: (name, data) => telemetry.trackEvent(name, data),
    trackPageView: (name) => telemetry.trackPageView(name),
    trackInteraction: (id, action) => telemetry.trackInteraction(id, action)
  };
}

// In your component
function MyComponent() {
  const { trackEvent, trackPageView } = useTelemetry();

  useEffect(() => {
    trackPageView('MyComponent');
  }, []);

  const handleClick = () => {
    trackEvent('button_clicked', { component: 'MyComponent' });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Pattern 4: Angular Integration

```typescript
// telemetry.service.ts
import { Injectable } from '@angular/core';
import { TelemetryTest } from './telemetry-test';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private telemetry: TelemetryTest;

  constructor() {
    this.telemetry = new TelemetryTest();
  }

  trackPageView(pageName: string): void {
    this.telemetry.trackPageView(pageName);
  }

  trackEvent(eventName: string, data?: any): void {
    this.telemetry.trackEvent(eventName, data);
  }

  getSummary() {
    return this.telemetry.getSummary();
  }
}

// In your component
import { Component, OnInit } from '@angular/core';
import { TelemetryService } from './telemetry.service';

@Component({
  selector: 'app-my-component',
  template: '<button (click)="onClick()">Track Event</button>'
})
export class MyComponent implements OnInit {
  constructor(private telemetry: TelemetryService) {}

  ngOnInit() {
    this.telemetry.trackPageView('MyComponent');
  }

  onClick() {
    this.telemetry.trackEvent('button_clicked');
  }
}
```

## Common Use Cases

### 1. Track Page Navigation

```javascript
// Single Page Application (SPA) routing
window.addEventListener('popstate', () => {
  telemetry.trackPageView(
    document.title,
    window.location.href
  );
});

// Or with a router library
router.afterEach((to, from) => {
  telemetry.trackPageView(to.name, to.path);
});
```

### 2. Track Form Submissions

```javascript
function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  telemetry.trackEvent('form_submitted', {
    formId: event.target.id,
    fields: Array.from(formData.keys())
  });
  
  // Submit form...
}
```

### 3. Track API Calls

```javascript
async function fetchData(url) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url);
    const duration = Date.now() - startTime;
    
    telemetry.trackPerformance('api_call', duration, 'ms');
    telemetry.trackEvent('api_success', {
      url,
      status: response.status,
      duration
    });
    
    return await response.json();
  } catch (error) {
    telemetry.trackError(error, 'api_call');
    throw error;
  }
}
```

### 4. Track Feature Usage

```javascript
class FeatureTracker {
  constructor(featureName) {
    this.featureName = featureName;
    this.startTime = Date.now();
    
    telemetry.trackEvent('feature_started', {
      feature: featureName
    });
  }

  complete(success = true) {
    const duration = Date.now() - this.startTime;
    telemetry.trackEvent('feature_completed', {
      feature: this.featureName,
      success,
      duration
    });
  }
}

// Usage
const tracker = new FeatureTracker('data-export');
// ... perform feature operations ...
tracker.complete(true);
```

### 5. Track User Sessions

```javascript
class SessionManager {
  constructor() {
    this.telemetry = new TelemetryTest();
    this.startSession();
    this.setupActivityTracking();
  }

  startSession() {
    telemetry.trackEvent('session_start', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`
    });
  }

  setupActivityTracking() {
    let lastActivity = Date.now();
    const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    setInterval(() => {
      if (Date.now() - lastActivity > IDLE_THRESHOLD) {
        telemetry.trackEvent('user_idle');
      }
    }, 60000);

    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        lastActivity = Date.now();
      });
    });
  }

  endSession() {
    const summary = telemetry.getSummary();
    telemetry.trackEvent('session_end', {
      duration: summary.sessionDuration,
      totalEvents: summary.totalEvents,
      eventBreakdown: summary.eventCounts
    });
  }
}
```

## Performance Considerations

### 1. Event Batching

```javascript
class BatchedTelemetry {
  constructor() {
    this.telemetry = new TelemetryTest();
    this.batch = [];
    this.batchSize = 10;
  }

  trackEvent(name, data) {
    this.batch.push({ name, data, timestamp: Date.now() });
    
    if (this.batch.length >= this.batchSize) {
      this.flush();
    }
  }

  flush() {
    this.batch.forEach(event => {
      this.telemetry.trackEvent(event.name, event.data);
    });
    this.batch = [];
  }
}
```

### 2. Sampling

```javascript
function trackWithSampling(eventName, data, sampleRate = 0.1) {
  if (Math.random() < sampleRate) {
    telemetry.trackEvent(eventName, data);
  }
}

// Track only 10% of scroll events
window.addEventListener('scroll', () => {
  trackWithSampling('page_scroll', {
    scrollY: window.scrollY
  }, 0.1);
});
```

## Testing

### Unit Testing

```javascript
// Example with Jest
describe('Telemetry Integration', () => {
  let telemetry;

  beforeEach(() => {
    telemetry = new TelemetryTest();
  });

  test('tracks page views correctly', () => {
    telemetry.trackPageView('Test Page');
    const events = telemetry.getEventsByName('page_view');
    expect(events).toHaveLength(1);
    expect(events[0].data.pageName).toBe('Test Page');
  });

  test('maintains session consistency', () => {
    const sessionId = telemetry.sessionId;
    telemetry.trackEvent('event1');
    telemetry.trackEvent('event2');
    
    const events = telemetry.getEvents();
    events.forEach(event => {
      expect(event.sessionId).toBe(sessionId);
    });
  });
});
```

### Integration Testing

```javascript
// Example with Cypress
describe('Telemetry Tracking', () => {
  beforeEach(() => {
    cy.visit('/test-page');
    cy.window().then(win => {
      win.telemetry = new win.TelemetryTest();
    });
  });

  it('tracks button clicks', () => {
    cy.get('#testButton').click();
    cy.window().its('telemetry').invoke('getEvents')
      .should('have.length', 1);
  });
});
```

## Troubleshooting

### Common Issues

1. **Events not being tracked**
   - Ensure telemetry is initialized before tracking events
   - Check browser console for errors
   - Verify that the script is loaded correctly

2. **Memory issues with large event counts**
   - Implement regular data clearing: `telemetry.clear()`
   - Use event batching and periodic exports
   - Set maximum event limits

3. **Performance impact**
   - Use sampling for high-frequency events
   - Implement debouncing for rapid events
   - Consider async tracking for non-critical events

## Best Practices

1. **Initialize early**: Set up telemetry as soon as your application loads
2. **Be consistent**: Use a standard naming convention for events
3. **Add context**: Include relevant data with each event
4. **Handle errors**: Always wrap tracking code in try-catch blocks
5. **Respect privacy**: Honor user preferences and data protection regulations
6. **Monitor performance**: Regularly review the impact of telemetry on app performance
7. **Document events**: Keep a registry of all tracked events and their purposes

## Support

For issues or questions about the telemetry feature:
- Review the README.md for detailed API documentation
- Check the test files for usage examples
- Open the demo page (telemetry-test.html) for interactive examples

## Version History

- **v1.0.0** (PBI-125): Initial release with core tracking functionality
