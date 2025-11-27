/**
 * Telemetry Configuration
 * PBI-125: Configuration options for telemetry test feature
 */

const TelemetryConfig = {
  // Enable/disable telemetry tracking
  enabled: true,

  // Batch size for event collection before sending
  batchSize: 10,

  // Auto-flush interval in milliseconds
  flushInterval: 30000, // 30 seconds

  // Maximum number of events to store in memory
  maxEvents: 1000,

  // Debug mode - log all events to console
  debug: true,

  // Event types to track
  eventTypes: {
    pageView: true,
    interaction: true,
    error: true,
    performance: true,
    custom: true
  },

  // Performance thresholds (in milliseconds)
  performanceThresholds: {
    pageLoad: 3000,
    apiResponse: 1000,
    renderTime: 500
  },

  // Error handling
  errorHandling: {
    captureStackTrace: true,
    maxStackDepth: 10,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection'
    ]
  },

  // Privacy settings
  privacy: {
    anonymizeIP: false,
    respectDoNotTrack: true,
    allowCookies: true
  },

  // Sample rate (0.0 to 1.0) - percentage of events to track
  sampleRate: 1.0,

  // Custom dimensions that can be added to all events
  customDimensions: {
    environment: 'development',
    version: '1.0.0',
    feature: 'PBI-125'
  }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TelemetryConfig;
}

if (typeof window !== 'undefined') {
  window.TelemetryConfig = TelemetryConfig;
}
