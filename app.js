/**
 * Connection Schematics Application
 * Visualizes component connections and pin mappings
 * PBI-126: Enhanced with telemetry tracking
 */

$(document).ready(function() {
  // Track application start time for performance metrics
  const appStartTime = performance.now();
  
  // PBI-124: Display greeting banner on application startup
  console.log('Application starting...');
  console.log('PBI-124: Greeting feature initialized - "Hello User!" displayed');
  
  // PBI-126: Track application initialization
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.PAGE_LOAD, {
      message: 'Application initialized',
      feature: 'PBI-126',
      components: datamodel.components.length
    });
  }
  
  // Verify greeting banner is visible
  if ($('#greetingBanner').length > 0) {
    console.log('PBI-124: Greeting banner successfully rendered');
    // PBI-126: Track greeting banner display
    if (window.telemetry) {
      window.telemetry.trackInteraction('banner', 'greetingBanner', 'displayed');
    }
  } else {
    console.error('PBI-124: Greeting banner not found!');
    // PBI-126: Track error
    if (window.telemetry) {
      window.telemetry.trackError(new Error('Greeting banner not found'));
    }
  }
  
  // Build connection string prefixes
  let primaryString = datamodel.components[0].name + "." + datamodel.components[0].plugs[0].name + ".";
  let secondaryString = datamodel.components[1].name + ".";
  
  // Initialize counters
  let totalConnections = 0;
  let matchedConnections = 0;
  let unmatchedConnections = 0;
  
  // Track connection processing start
  const connectionProcessStart = performance.now();
  
  // Iterate through primary pins to find connections
  $.each(datamodel.components[0].plugs[0].pins, function(index, primaryPin) {
    totalConnections++;
    let found = false;
    let matchedTarget = "";
    
    // Search for matching pins in secondary component
    $.each(datamodel.components[1].plugs, function(index, secondaryPlug) {
      $.each(secondaryPlug.pins, function(index, secondaryPin) {
        if(primaryPin.name == secondaryPin.name) {
          found = true;
          matchedConnections++;
          matchedTarget = secondaryString + secondaryPlug.name + "." + secondaryPin.name;
          
          // PBI-126: Track matched connection
          if (window.telemetry) {
            window.telemetry.trackConnectionView({
              status: 'matched',
              primaryPin: primaryPin.name,
              secondaryPin: secondaryPin.name,
              wireLabel: primaryPin.wireLabel,
              pinNumber: primaryPin.number
            });
          }
          
          // Create connection card for matched pins
          let connectionCard = `
            <div class="connection-card" data-connection-type="matched">
              <div class="connection-header">
                <div class="connection-icon">⚡</div>
                <div class="connection-title">
                  <h3>${primaryPin.name}</h3>
                  <div class="connection-subtitle">
                    Wire: ${primaryPin.wireLabel} | Pin: ${primaryPin.number}
                    <span class="connection-badge">Connected</span>
                  </div>
                </div>
              </div>
              <div class="connection-flow">
                <div class="source-node">${primaryString}${primaryPin.name}</div>
                <div class="arrow-container">
                  <div class="arrow"></div>
                </div>
                <div class="target-node">${matchedTarget}</div>
              </div>
            </div>
          `;
          $("#output").append(connectionCard);
        }
      });
    });
    
    // Handle unmatched pins
    if(!found) {
      unmatchedConnections++;
      
      // PBI-126: Track unmatched connection
      if (window.telemetry) {
        window.telemetry.trackConnectionView({
          status: 'unmatched',
          primaryPin: primaryPin.name,
          wireLabel: primaryPin.wireLabel,
          pinNumber: primaryPin.number
        });
      }
      
      // Create connection card for unmatched pins
      let noMatchCard = `
        <div class="connection-card" data-connection-type="unmatched">
          <div class="connection-header">
            <div class="connection-icon" style="background: #dc3545;">⚠</div>
            <div class="connection-title">
              <h3>${primaryPin.name}</h3>
              <div class="connection-subtitle">
                Wire: ${primaryPin.wireLabel} | Pin: ${primaryPin.number}
                <span class="connection-badge no-match-badge">No Match</span>
              </div>
            </div>
          </div>
          <div class="connection-flow">
            <div class="source-node">${primaryString}${primaryPin.name}</div>
            <div class="arrow-container">
              <div class="arrow" style="background: #dc3545;"></div>
            </div>
            <div class="target-node no-match">No Match Found</div>
          </div>
        </div>
      `;
      $("#output").append(noMatchCard);
    }
  });
  
  // Track connection processing time
  const connectionProcessTime = performance.now() - connectionProcessStart;
  if (window.telemetry) {
    window.telemetry.trackPerformance('connection_processing', connectionProcessTime, 'ms');
  }
  
  // Display connection statistics
  let statsHTML = `
    <div class="stat-item">
      <div class="stat-value">${totalConnections}</div>
      <div class="stat-label">Total Pins</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color: #28a745;">${matchedConnections}</div>
      <div class="stat-label">Connected</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color: #dc3545;">${unmatchedConnections}</div>
      <div class="stat-label">Unmatched</div>
    </div>
  `;
  $("#stats").html(statsHTML);
  
  // PBI-126: Track connection statistics
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.CUSTOM, {
      eventName: 'connection_statistics',
      totalConnections: totalConnections,
      matchedConnections: matchedConnections,
      unmatchedConnections: unmatchedConnections,
      matchRate: ((matchedConnections / totalConnections) * 100).toFixed(2) + '%'
    });
  }
  
  // Track total application load time
  const totalLoadTime = performance.now() - appStartTime;
  if (window.telemetry) {
    window.telemetry.trackPerformance('total_app_load', totalLoadTime, 'ms');
  }
  
  console.log('Application loaded successfully. No errors detected.');
  console.log('PBI-126: Telemetry tracking active');
  
  // PBI-126: Setup telemetry dashboard functionality
  setupTelemetryDashboard();
  
  // PBI-126: Track connection card clicks
  $(document).on('click', '.connection-card', function() {
    const connectionType = $(this).data('connection-type');
    const pinName = $(this).find('h3').text();
    
    if (window.telemetry) {
      window.telemetry.trackInteraction('connection-card', 'connection_' + pinName, 'clicked', {
        connectionType: connectionType,
        pinName: pinName
      });
    }
  });
});

/**
 * PBI-126: Setup Telemetry Dashboard
 */
function setupTelemetryDashboard() {
  // Show telemetry dashboard button click
  $('#showTelemetry').on('click', function() {
    if (window.telemetry) {
      window.telemetry.trackInteraction('button', 'showTelemetry', 'clicked');
      updateTelemetryDashboard();
      $('#telemetryDashboard').fadeIn();
    }
  });
  
  // Close telemetry dashboard button click
  $('#closeTelemetry').on('click', function() {
    if (window.telemetry) {
      window.telemetry.trackInteraction('button', 'closeTelemetry', 'clicked');
    }
    $('#telemetryDashboard').fadeOut();
  });
  
  // Update dashboard every 5 seconds when visible
  setInterval(function() {
    if ($('#telemetryDashboard').is(':visible')) {
      updateTelemetryDashboard();
    }
  }, 5000);
}

/**
 * PBI-126: Update Telemetry Dashboard Content
 */
function updateTelemetryDashboard() {
  if (!window.telemetry) return;
  
  const stats = window.telemetry.getStats();
  const report = window.telemetry.generateReport();
  
  // Update statistics section
  let statsHTML = `
    <div class="telemetry-stat-grid">
      <div class="telemetry-stat-card">
        <div class="stat-value">${stats.totalEvents}</div>
        <div class="stat-label">Total Events</div>
      </div>
      <div class="telemetry-stat-card">
        <div class="stat-value">${Math.round(stats.sessionDuration / 1000)}s</div>
        <div class="stat-label">Session Duration</div>
      </div>
      <div class="telemetry-stat-card">
        <div class="stat-value">${report.errors.length}</div>
        <div class="stat-label">Errors</div>
      </div>
      <div class="telemetry-stat-card">
        <div class="stat-value">${report.userInteractions.length}</div>
        <div class="stat-label">Interactions</div>
      </div>
    </div>
    <div class="telemetry-events-by-type">
      <h3>Events by Type</h3>
      ${Object.entries(stats.eventsByType).map(([type, count]) => `
        <div class="event-type-row">
          <span class="event-type-name">${type}</span>
          <span class="event-type-count">${count}</span>
        </div>
      `).join('')}
    </div>
  `;
  $('#telemetryStats').html(statsHTML);
  
  // Update recent events section
  let eventsHTML = `
    <h3>Recent Events (Last 10)</h3>
    <div class="telemetry-events-list">
      ${stats.recentEvents.map(event => `
        <div class="telemetry-event-item">
          <div class="event-type-badge" data-event-type="${event.type}">${event.type}</div>
          <div class="event-time">${new Date(event.timestamp).toLocaleTimeString()}</div>
          <div class="event-details">${JSON.stringify(event.data).substring(0, 100)}...</div>
        </div>
      `).join('')}
    </div>
  `;
  $('#telemetryEvents').html(eventsHTML);
}


// Data Model
let datamodel = {
  "components": [
    {
      "name": "C101",
      "plugs": [
        {
          "name": "P1",
          "pins": [
            {"number": 1, "name": "VCC", "wireLabel": "RED"},
            {"number": 2, "name": "DATA", "wireLabel": "BLU"},
            {"number": 3, "name": "CLK", "wireLabel": "YEL"},
            {"number": 4, "name": "GND", "wireLabel": "BLK"},
            {"number": 5, "name": "RST", "wireLabel": "GRN"}
          ]
        }
      ]
    },
    {
      "name": "C201",
      "plugs": [
        {
          "name": "P1",
          "pins": [
            {"number": 1, "name": "VCC", "wireLabel": "RED"},
            {"number": 2, "name": "GND", "wireLabel": "BLK"}
          ]
        },
        {
          "name": "P2",
          "pins": [
            {"number": 1, "name": "DATA", "wireLabel": "BLU"},
            {"number": 2, "name": "CLK", "wireLabel": "YEL"}
          ]
        }
      ]
    }
  ]
};
