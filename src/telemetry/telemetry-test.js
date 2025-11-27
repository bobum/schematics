/**
 * Telemetry Test Feature
 * PBI-125: Simple test feature to generate telemetry data
 * 
 * This module provides functionality to generate and track telemetry events
 * for testing and monitoring purposes.
 */

class TelemetryTest {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  /**
   * Generate a unique session ID for tracking
   * @returns {string} Unique session identifier
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track a telemetry event
   * @param {string} eventName - Name of the event
   * @param {object} eventData - Additional data associated with the event
   */
  trackEvent(eventName, eventData = {}) {
    const event = {
      sessionId: this.sessionId,
      eventName,
      timestamp: Date.now(),
      data: eventData,
      duration: Date.now() - this.startTime
    };

    this.events.push(event);
    console.log('[Telemetry]', event);
    return event;
  }

  /**
   * Track a page view event
   * @param {string} pageName - Name of the page
   * @param {string} url - URL of the page
   */
  trackPageView(pageName, url = window.location.href) {
    return this.trackEvent('page_view', {
      pageName,
      url,
      referrer: document.referrer
    });
  }

  /**
   * Track a user interaction event
   * @param {string} elementId - ID of the element interacted with
   * @param {string} action - Type of interaction (click, hover, etc.)
   */
  trackInteraction(elementId, action) {
    return this.trackEvent('user_interaction', {
      elementId,
      action,
      timestamp: Date.now()
    });
  }

  /**
   * Track an error event
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  trackError(error, context = 'unknown') {
    return this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  /**
   * Track a performance metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Metric value
   * @param {string} unit - Unit of measurement
   */
  trackPerformance(metricName, value, unit = 'ms') {
    return this.trackEvent('performance', {
      metricName,
      value,
      unit
    });
  }

  /**
   * Get all tracked events
   * @returns {Array} Array of all telemetry events
   */
  getEvents() {
    return [...this.events];
  }

  /**
   * Get events filtered by name
   * @param {string} eventName - Name to filter by
   * @returns {Array} Filtered array of events
   */
  getEventsByName(eventName) {
    return this.events.filter(event => event.eventName === eventName);
  }

  /**
   * Get telemetry summary
   * @returns {object} Summary statistics
   */
  getSummary() {
    const eventCounts = {};
    this.events.forEach(event => {
      eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
    });

    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.startTime,
      eventCounts,
      firstEvent: this.events[0] || null,
      lastEvent: this.events[this.events.length - 1] || null
    };
  }

  /**
   * Clear all telemetry data
   */
  clear() {
    this.events = [];
    this.startTime = Date.now();
  }

  /**
   * Export telemetry data as JSON
   * @returns {string} JSON string of telemetry data
   */
  exportData() {
    return JSON.stringify({
      sessionId: this.sessionId,
      startTime: this.startTime,
      events: this.events,
      summary: this.getSummary()
    }, null, 2);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TelemetryTest;
}

// Global instance
if (typeof window !== 'undefined') {
  window.TelemetryTest = TelemetryTest;
}
