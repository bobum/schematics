/**
 * Telemetry Module - PBI-126
 * Tracks and logs user interactions and application events
 * Provides analytics and monitoring capabilities
 */

(function() {
  'use strict';
  
  // Telemetry configuration
  const TelemetryConfig = {
    enabled: true,
    logToConsole: true,
    logToLocalStorage: true,
    maxStoredEvents: 100,
    storageKey: 'telemetry_events',
    sessionKey: 'telemetry_session_id'
  };
  
  // Event types
  const EventTypes = {
    PAGE_LOAD: 'page_load',
    USER_INTERACTION: 'user_interaction',
    THEME_CHANGE: 'theme_change',
    CONNECTION_VIEW: 'connection_view',
    ERROR: 'error',
    PERFORMANCE: 'performance',
    CUSTOM: 'custom'
  };
  
  // Telemetry class
  class Telemetry {
    constructor() {
      this.sessionId = this.getOrCreateSessionId();
      this.events = [];
      this.startTime = Date.now();
      this.initializeEventListeners();
      this.loadStoredEvents();
      
      // Log initialization
      this.logEvent(EventTypes.PAGE_LOAD, {
        message: 'Telemetry system initialized',
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    }
    
    /**
     * Generate or retrieve session ID
     */
    getOrCreateSessionId() {
      let sessionId = sessionStorage.getItem(TelemetryConfig.sessionKey);
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(TelemetryConfig.sessionKey, sessionId);
      }
      return sessionId;
    }
    
    /**
     * Load previously stored events from localStorage
     */
    loadStoredEvents() {
      if (!TelemetryConfig.logToLocalStorage) return;
      
      try {
        const storedEvents = localStorage.getItem(TelemetryConfig.storageKey);
        if (storedEvents) {
          this.events = JSON.parse(storedEvents);
          if (TelemetryConfig.logToConsole) {
            console.log('[Telemetry] Loaded', this.events.length, 'stored events');
          }
        }
      } catch (error) {
        console.error('[Telemetry] Error loading stored events:', error);
      }
    }
    
    /**
     * Save events to localStorage
     */
    saveEvents() {
      if (!TelemetryConfig.logToLocalStorage) return;
      
      try {
        // Keep only the most recent events
        const eventsToStore = this.events.slice(-TelemetryConfig.maxStoredEvents);
        localStorage.setItem(TelemetryConfig.storageKey, JSON.stringify(eventsToStore));
      } catch (error) {
        console.error('[Telemetry] Error saving events:', error);
      }
    }
    
    /**
     * Log a telemetry event
     */
    logEvent(eventType, data = {}) {
      if (!TelemetryConfig.enabled) return;
      
      const event = {
        id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        sessionId: this.sessionId,
        type: eventType,
        timestamp: Date.now(),
        isoTimestamp: new Date().toISOString(),
        data: data,
        pageUrl: window.location.href,
        sessionDuration: Date.now() - this.startTime
      };
      
      this.events.push(event);
      
      // Log to console
      if (TelemetryConfig.logToConsole) {
        console.log('[Telemetry]', eventType, event);
      }
      
      // Save to localStorage
      this.saveEvents();
      
      return event;
    }
    
    /**
     * Track user interactions
     */
    trackInteraction(elementType, elementId, action, additionalData = {}) {
      return this.logEvent(EventTypes.USER_INTERACTION, {
        elementType: elementType,
        elementId: elementId,
        action: action,
        ...additionalData
      });
    }
    
    /**
     * Track theme changes
     */
    trackThemeChange(theme) {
      return this.logEvent(EventTypes.THEME_CHANGE, {
        theme: theme,
        message: `Theme changed to ${theme}`
      });
    }
    
    /**
     * Track connection views
     */
    trackConnectionView(connectionData) {
      return this.logEvent(EventTypes.CONNECTION_VIEW, connectionData);
    }
    
    /**
     * Track errors
     */
    trackError(error, context = {}) {
      return this.logEvent(EventTypes.ERROR, {
        error: error.toString(),
        stack: error.stack,
        context: context
      });
    }
    
    /**
     * Track performance metrics
     */
    trackPerformance(metric, value, unit = 'ms') {
      return this.logEvent(EventTypes.PERFORMANCE, {
        metric: metric,
        value: value,
        unit: unit
      });
    }
    
    /**
     * Initialize automatic event listeners
     */
    initializeEventListeners() {
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        this.logEvent(EventTypes.USER_INTERACTION, {
          action: 'visibility_change',
          visible: !document.hidden
        });
      });
      
      // Track window resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.logEvent(EventTypes.USER_INTERACTION, {
            action: 'window_resize',
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          });
        }, 500);
      });
      
      // Track errors
      window.addEventListener('error', (event) => {
        this.trackError(event.error || new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
      
      // Track unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.trackError(new Error('Unhandled Promise Rejection: ' + event.reason));
      });
      
      // Track page unload
      window.addEventListener('beforeunload', () => {
        this.logEvent(EventTypes.PAGE_LOAD, {
          action: 'page_unload',
          sessionDuration: Date.now() - this.startTime
        });
      });
    }
    
    /**
     * Get all events
     */
    getEvents(filter = {}) {
      let filteredEvents = this.events;
      
      if (filter.type) {
        filteredEvents = filteredEvents.filter(e => e.type === filter.type);
      }
      
      if (filter.sessionId) {
        filteredEvents = filteredEvents.filter(e => e.sessionId === filter.sessionId);
      }
      
      if (filter.startTime) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.startTime);
      }
      
      if (filter.endTime) {
        filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.endTime);
      }
      
      return filteredEvents;
    }
    
    /**
     * Get event statistics
     */
    getStats() {
      const stats = {
        totalEvents: this.events.length,
        sessionId: this.sessionId,
        sessionDuration: Date.now() - this.startTime,
        eventsByType: {},
        recentEvents: this.events.slice(-10)
      };
      
      // Count events by type
      this.events.forEach(event => {
        stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
      });
      
      return stats;
    }
    
    /**
     * Clear all events
     */
    clearEvents() {
      this.events = [];
      if (TelemetryConfig.logToLocalStorage) {
        localStorage.removeItem(TelemetryConfig.storageKey);
      }
      console.log('[Telemetry] All events cleared');
    }
    
    /**
     * Export events as JSON
     */
    exportEvents() {
      return JSON.stringify(this.events, null, 2);
    }
    
    /**
     * Generate telemetry report
     */
    generateReport() {
      const stats = this.getStats();
      const report = {
        generatedAt: new Date().toISOString(),
        sessionId: this.sessionId,
        sessionDuration: stats.sessionDuration,
        totalEvents: stats.totalEvents,
        eventsByType: stats.eventsByType,
        performanceMetrics: this.getEvents({ type: EventTypes.PERFORMANCE }),
        errors: this.getEvents({ type: EventTypes.ERROR }),
        userInteractions: this.getEvents({ type: EventTypes.USER_INTERACTION })
      };
      
      return report;
    }
  }
  
  // Initialize global telemetry instance
  window.telemetry = new Telemetry();
  
  // Expose EventTypes for external use
  window.TelemetryEventTypes = EventTypes;
  
  // Log successful initialization
  console.log('[Telemetry] PBI-126 - Telemetry system ready');
  console.log('[Telemetry] Session ID:', window.telemetry.sessionId);
  console.log('[Telemetry] Use window.telemetry to access telemetry API');
  console.log('[Telemetry] Available methods:');
  console.log('  - telemetry.logEvent(type, data)');
  console.log('  - telemetry.trackInteraction(element, id, action)');
  console.log('  - telemetry.trackThemeChange(theme)');
  console.log('  - telemetry.trackError(error)');
  console.log('  - telemetry.getStats()');
  console.log('  - telemetry.generateReport()');
  console.log('  - telemetry.exportEvents()');
  
})();
