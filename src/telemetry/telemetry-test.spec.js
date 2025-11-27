/**
 * Unit Tests for Telemetry Test Feature
 * PBI-125: Simple test feature to generate telemetry data
 */

// Mock browser globals for Node.js testing
if (typeof window === 'undefined') {
  global.window = {
    location: { href: 'http://localhost/test' }
  };
  global.document = {
    referrer: 'http://localhost'
  };
}

const TelemetryTest = require('./telemetry-test');

describe('TelemetryTest', () => {
  let telemetry;

  beforeEach(() => {
    telemetry = new TelemetryTest();
  });

  describe('Initialization', () => {
    test('should create instance with empty events array', () => {
      expect(telemetry.events).toEqual([]);
    });

    test('should generate unique session ID', () => {
      const telemetry1 = new TelemetryTest();
      const telemetry2 = new TelemetryTest();
      expect(telemetry1.sessionId).not.toEqual(telemetry2.sessionId);
    });

    test('should set start time', () => {
      expect(telemetry.startTime).toBeDefined();
      expect(typeof telemetry.startTime).toBe('number');
    });
  });

  describe('trackEvent', () => {
    test('should track basic event', () => {
      const event = telemetry.trackEvent('test_event', { foo: 'bar' });
      expect(event.eventName).toBe('test_event');
      expect(event.data.foo).toBe('bar');
      expect(telemetry.events.length).toBe(1);
    });

    test('should include session ID in event', () => {
      const event = telemetry.trackEvent('test');
      expect(event.sessionId).toBe(telemetry.sessionId);
    });

    test('should include timestamp', () => {
      const event = telemetry.trackEvent('test');
      expect(event.timestamp).toBeDefined();
      expect(typeof event.timestamp).toBe('number');
    });

    test('should track duration since session start', () => {
      const event = telemetry.trackEvent('test');
      expect(event.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('trackPageView', () => {
    test('should track page view event', () => {
      const event = telemetry.trackPageView('Home Page', 'http://example.com');
      expect(event.eventName).toBe('page_view');
      expect(event.data.pageName).toBe('Home Page');
      expect(event.data.url).toBe('http://example.com');
    });

    test('should use window location if URL not provided', () => {
      const event = telemetry.trackPageView('Test Page');
      expect(event.data.url).toBeDefined();
    });
  });

  describe('trackInteraction', () => {
    test('should track user interaction', () => {
      const event = telemetry.trackInteraction('button-123', 'click');
      expect(event.eventName).toBe('user_interaction');
      expect(event.data.elementId).toBe('button-123');
      expect(event.data.action).toBe('click');
    });
  });

  describe('trackError', () => {
    test('should track error with stack trace', () => {
      const error = new Error('Test error');
      const event = telemetry.trackError(error, 'test-context');
      expect(event.eventName).toBe('error');
      expect(event.data.message).toBe('Test error');
      expect(event.data.context).toBe('test-context');
      expect(event.data.stack).toBeDefined();
    });
  });

  describe('trackPerformance', () => {
    test('should track performance metric', () => {
      const event = telemetry.trackPerformance('load_time', 250, 'ms');
      expect(event.eventName).toBe('performance');
      expect(event.data.metricName).toBe('load_time');
      expect(event.data.value).toBe(250);
      expect(event.data.unit).toBe('ms');
    });

    test('should use default unit if not provided', () => {
      const event = telemetry.trackPerformance('metric', 100);
      expect(event.data.unit).toBe('ms');
    });
  });

  describe('getEvents', () => {
    test('should return all events', () => {
      telemetry.trackEvent('event1');
      telemetry.trackEvent('event2');
      const events = telemetry.getEvents();
      expect(events.length).toBe(2);
    });

    test('should return copy of events array', () => {
      telemetry.trackEvent('test');
      const events = telemetry.getEvents();
      events.push({ fake: 'event' });
      expect(telemetry.events.length).toBe(1);
    });
  });

  describe('getEventsByName', () => {
    test('should filter events by name', () => {
      telemetry.trackEvent('event1');
      telemetry.trackEvent('event2');
      telemetry.trackEvent('event1');
      const filtered = telemetry.getEventsByName('event1');
      expect(filtered.length).toBe(2);
      expect(filtered.every(e => e.eventName === 'event1')).toBe(true);
    });

    test('should return empty array if no matches', () => {
      telemetry.trackEvent('event1');
      const filtered = telemetry.getEventsByName('nonexistent');
      expect(filtered).toEqual([]);
    });
  });

  describe('getSummary', () => {
    test('should return summary statistics', () => {
      telemetry.trackEvent('event1');
      telemetry.trackEvent('event2');
      telemetry.trackEvent('event1');
      const summary = telemetry.getSummary();
      
      expect(summary.totalEvents).toBe(3);
      expect(summary.eventCounts.event1).toBe(2);
      expect(summary.eventCounts.event2).toBe(1);
      expect(summary.sessionId).toBe(telemetry.sessionId);
      expect(summary.sessionDuration).toBeGreaterThanOrEqual(0);
    });

    test('should include first and last events', () => {
      telemetry.trackEvent('first');
      telemetry.trackEvent('last');
      const summary = telemetry.getSummary();
      
      expect(summary.firstEvent.eventName).toBe('first');
      expect(summary.lastEvent.eventName).toBe('last');
    });

    test('should handle empty events', () => {
      const summary = telemetry.getSummary();
      expect(summary.totalEvents).toBe(0);
      expect(summary.firstEvent).toBeNull();
      expect(summary.lastEvent).toBeNull();
    });
  });

  describe('clear', () => {
    test('should clear all events', () => {
      telemetry.trackEvent('event1');
      telemetry.trackEvent('event2');
      telemetry.clear();
      expect(telemetry.events.length).toBe(0);
    });

    test('should reset start time', () => {
      const oldStartTime = telemetry.startTime;
      setTimeout(() => {
        telemetry.clear();
        expect(telemetry.startTime).toBeGreaterThan(oldStartTime);
      }, 10);
    });
  });

  describe('exportData', () => {
    test('should export data as JSON string', () => {
      telemetry.trackEvent('test');
      const exported = telemetry.exportData();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed.sessionId).toBe(telemetry.sessionId);
      expect(parsed.events.length).toBe(1);
      expect(parsed.summary).toBeDefined();
    });

    test('should include all event data', () => {
      telemetry.trackEvent('event1', { data: 'test' });
      telemetry.trackPageView('Page');
      const exported = JSON.parse(telemetry.exportData());
      
      expect(exported.events.length).toBe(2);
      expect(exported.events[0].data.data).toBe('test');
    });
  });

  describe('Session Management', () => {
    test('should maintain same session ID throughout lifecycle', () => {
      const originalId = telemetry.sessionId;
      telemetry.trackEvent('event1');
      telemetry.trackEvent('event2');
      expect(telemetry.sessionId).toBe(originalId);
    });

    test('should create unique session IDs for different instances', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        const t = new TelemetryTest();
        ids.add(t.sessionId);
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('Data Integrity', () => {
    test('should preserve event order', () => {
      telemetry.trackEvent('first');
      telemetry.trackEvent('second');
      telemetry.trackEvent('third');
      
      const events = telemetry.getEvents();
      expect(events[0].eventName).toBe('first');
      expect(events[1].eventName).toBe('second');
      expect(events[2].eventName).toBe('third');
    });

    test('should handle special characters in event data', () => {
      const specialData = {
        unicode: '👍 测试',
        quotes: '"single" and \'double\'',
        newlines: 'line1\nline2'
      };
      const event = telemetry.trackEvent('special', specialData);
      expect(event.data).toEqual(specialData);
    });

    test('should handle large event counts', () => {
      for (let i = 0; i < 1000; i++) {
        telemetry.trackEvent('event_' + i);
      }
      expect(telemetry.events.length).toBe(1000);
      const summary = telemetry.getSummary();
      expect(summary.totalEvents).toBe(1000);
    });
  });
});

// Test runner for browser environment
if (typeof window !== 'undefined' && !window.jasmine && !window.mocha) {
  console.log('Running telemetry tests...');
  
  // Simple test runner
  let passed = 0;
  let failed = 0;
  
  function runTests() {
    const telemetry = new TelemetryTest();
    
    // Test 1: Basic tracking
    try {
      const event = telemetry.trackEvent('test', { data: 'value' });
      if (event.eventName === 'test' && event.data.data === 'value') {
        console.log('✓ Basic tracking works');
        passed++;
      } else {
        throw new Error('Event structure incorrect');
      }
    } catch (e) {
      console.error('✗ Basic tracking failed:', e);
      failed++;
    }
    
    // Test 2: Multiple events
    try {
      telemetry.trackPageView('Page');
      telemetry.trackInteraction('button', 'click');
      if (telemetry.getEvents().length === 3) {
        console.log('✓ Multiple events tracked');
        passed++;
      } else {
        throw new Error('Event count incorrect');
      }
    } catch (e) {
      console.error('✗ Multiple events failed:', e);
      failed++;
    }
    
    // Test 3: Summary
    try {
      const summary = telemetry.getSummary();
      if (summary.totalEvents === 3 && summary.sessionId) {
        console.log('✓ Summary generation works');
        passed++;
      } else {
        throw new Error('Summary incorrect');
      }
    } catch (e) {
      console.error('✗ Summary failed:', e);
      failed++;
    }
    
    console.log(`\nTests complete: ${passed} passed, ${failed} failed`);
  }
  
  runTests();
}
