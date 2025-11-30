/**
 * Connection Schematics Application - TASK-001 Enhanced
 * Visualizes component connections with interactive visual cards
 * REPLACES simple list-based (<li>) representation with rich visual components
 * PBI-126: Enhanced with telemetry tracking
 */

$(document).ready(function() {
  const appStartTime = performance.now();
  
  console.log('='.repeat(60));
  console.log('TASK-001: Enhanced Visual Connection Representation');
  console.log('Replacing simple list elements with interactive visual cards');
  console.log('='.repeat(60));
  
  // PBI-126: Track application initialization
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.PAGE_LOAD, {
      message: 'TASK-001: Application initialized with visual connections',
      feature: 'TASK-001 + PBI-126',
      components: datamodel.components.length
    });
  }
  
  // Build connection string prefixes
  let primaryString = datamodel.components[0].name + "." + datamodel.components[0].plugs[0].name + ".";
  let secondaryString = datamodel.components[1].name + ".";
  
  // Initialize counters
  let totalConnections = 0;
  let matchedConnections = 0;
  let unmatchedConnections = 0;
  
  const connectionProcessStart = performance.now();
  
  console.log('TASK-001: Building visual connection cards...');
  
  // Iterate through primary pins to find connections
  $.each(datamodel.components[0].plugs[0].pins, function(index, primaryPin) {
    totalConnections++;
    let found = false;
    let matchedTarget = "";
    let matchedPinNumber = "";
    
    // Search for matching pins in secondary component
    $.each(datamodel.components[1].plugs, function(plugIndex, secondaryPlug) {
      $.each(secondaryPlug.pins, function(pinIndex, secondaryPin) {
        if(primaryPin.name == secondaryPin.name) {
          found = true;
          matchedConnections++;
          matchedTarget = secondaryString + secondaryPlug.name + "." + secondaryPin.name;
          matchedPinNumber = secondaryPin.number;
          
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
          
          // TASK-001: Create ENHANCED visual connection card (replaces <li>)
          let connectionCard = `
            <div class="connection-card" data-connection-type="matched" 
                 data-pin-name="${primaryPin.name}"
                 style="animation-delay: ${index * 0.1}s;">
              <div class="connection-header">
                <div class="connection-icon">⚡</div>
                <div class="connection-title">
                  <h3>${primaryPin.name}</h3>
                  <div class="connection-subtitle">
                    <span class="wire-info">🔌 Wire: <strong>${primaryPin.wireLabel}</strong></span>
                    <span class="pin-info">📍 Pin: <strong>${primaryPin.number}</strong></span>
                    <span class="connection-badge">✓ Connected</span>
                  </div>
                </div>
              </div>
              <div class="connection-flow">
                <div class="source-node" title="${primaryString}${primaryPin.name}">
                  <div class="node-label">SOURCE</div>
                  <div class="node-content">${primaryPin.name}</div>
                  <div class="node-pin">Pin ${primaryPin.number}</div>
                </div>
                <div class="arrow-container">
                  <div class="arrow">
                    <div class="signal-pulse"></div>
                  </div>
                  <div class="wire-label">${primaryPin.wireLabel}</div>
                </div>
                <div class="target-node" title="${matchedTarget}">
                  <div class="node-label">TARGET</div>
                  <div class="node-content">${secondaryPin.name}</div>
                  <div class="node-pin">Pin ${matchedPinNumber}</div>
                </div>
              </div>
              <div class="connection-details">
                <div class="detail-item">
                  <span class="detail-icon">🔗</span>
                  <span class="detail-text">${primaryString}${primaryPin.name} → ${matchedTarget}</span>
                </div>
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
      
      // TASK-001: Create ENHANCED visual card for unmatched (replaces <li>)
      let noMatchCard = `
        <div class="connection-card" data-connection-type="unmatched"
             data-pin-name="${primaryPin.name}"
             style="animation-delay: ${index * 0.1}s;">
          <div class="connection-header">
            <div class="connection-icon" style="background: linear-gradient(135deg, #dc3545 0%, #ff6b7a 100%);">⚠</div>
            <div class="connection-title">
              <h3>${primaryPin.name}</h3>
              <div class="connection-subtitle">
                <span class="wire-info">🔌 Wire: <strong>${primaryPin.wireLabel}</strong></span>
                <span class="pin-info">📍 Pin: <strong>${primaryPin.number}</strong></span>
                <span class="connection-badge no-match-badge">✗ No Match</span>
              </div>
            </div>
          </div>
          <div class="connection-flow">
            <div class="source-node" title="${primaryString}${primaryPin.name}">
              <div class="node-label">SOURCE</div>
              <div class="node-content">${primaryPin.name}</div>
              <div class="node-pin">Pin ${primaryPin.number}</div>
            </div>
            <div class="arrow-container">
              <div class="arrow" style="background: linear-gradient(90deg, #dc3545 0%, #ff6b7a 100%);">
                <div class="signal-pulse" style="background: #dc3545;"></div>
              </div>
              <div class="wire-label">${primaryPin.wireLabel}</div>
            </div>
            <div class="target-node no-match" title="No matching connection found">
              <div class="node-label">TARGET</div>
              <div class="node-content">No Match</div>
              <div class="node-pin">N/A</div>
            </div>
          </div>
          <div class="connection-details">
            <div class="detail-item">
              <span class="detail-icon">⚠</span>
              <span class="detail-text" style="color: #dc3545;">${primaryString}${primaryPin.name} → No target found</span>
            </div>
          </div>
        </div>
      `;
      $("#output").append(noMatchCard);
    }
  });
  
  const connectionProcessTime = performance.now() - connectionProcessStart;
  console.log(`TASK-001: Created ${totalConnections} interactive visual cards in ${connectionProcessTime.toFixed(2)}ms`);
  console.log(`  ✓ ${matchedConnections} matched connections with animated flows`);
  console.log(`  ✗ ${unmatchedConnections} unmatched connections highlighted`);
  
  if (window.telemetry) {
    window.telemetry.trackPerformance('connection_processing', connectionProcessTime, 'ms');
  }
  
  // TASK-001: Enhanced statistics with visual indicators
  let statsHTML = `
    <div class="stat-item">
      <div class="stat-icon">📊</div>
      <div class="stat-value">${totalConnections}</div>
      <div class="stat-label">Total Connections</div>
      <div class="stat-bar" style="width: 100%; background: #667eea;"></div>
    </div>
    <div class="stat-item">
      <div class="stat-icon">✅</div>
      <div class="stat-value" style="color: #28a745;">${matchedConnections}</div>
      <div class="stat-label">Successfully Matched</div>
      <div class="stat-bar" style="width: ${(matchedConnections/totalConnections)*100}%; background: #28a745;"></div>
    </div>
    <div class="stat-item">
      <div class="stat-icon">❌</div>
      <div class="stat-value" style="color: #dc3545;">${unmatchedConnections}</div>
      <div class="stat-label">Unmatched</div>
      <div class="stat-bar" style="width: ${(unmatchedConnections/totalConnections)*100}%; background: #dc3545;"></div>
    </div>
  `;
  $("#stats").html(statsHTML);
  
  // PBI-126: Track statistics
  if (window.telemetry) {
    window.telemetry.logEvent(window.TelemetryEventTypes.CUSTOM, {
      eventName: 'connection_statistics',
      feature: 'TASK-001',
      totalConnections: totalConnections,
      matchedConnections: matchedConnections,
      unmatchedConnections: unmatchedConnections,
      matchRate: ((matchedConnections / totalConnections) * 100).toFixed(2) + '%'
    });
  }
  
  // TASK-001: Add interactive click handlers
  $(document).on('click', '.connection-card', function() {
    const $card = $(this);
    const connectionType = $card.data('connection-type');
    const pinName = $card.find('h3').text();
    
    $card.addClass('clicked');
    setTimeout(() => $card.removeClass('clicked'), 300);
    
    console.log(`TASK-001: User clicked ${connectionType} connection: ${pinName}`);
    
    if (window.telemetry) {
      window.telemetry.trackInteraction('connection-card', 'connection_' + pinName, 'clicked', {
        connectionType: connectionType,
        pinName: pinName,
        feature: 'TASK-001'
      });
    }
    
    $('.connection-card').removeClass('highlighted');
    $card.addClass('highlighted');
    setTimeout(() => $card.removeClass('highlighted'), 2000);
  });
  
  // TASK-001: Add hover logging
  $(document).on('mouseenter', '.connection-card', function() {
    const pinName = $(this).find('h3').text();
    console.log(`TASK-001: Hovering over connection: ${pinName}`);
  });
  
  const totalLoadTime = performance.now() - appStartTime;
  if (window.telemetry) {
    window.telemetry.trackPerformance('total_app_load', totalLoadTime, 'ms');
  }
  
  console.log('='.repeat(60));
  console.log('TASK-001: Visual representation complete!');
  console.log(`Application loaded in ${totalLoadTime.toFixed(2)}ms`);
  console.log('Enhanced visual connections active - NO list elements (<li>) used');
  console.log('PBI-126: Telemetry tracking active');
  console.log('='.repeat(60));
  
  setupTelemetryDashboard();
});

function setupTelemetryDashboard() {
  $('#showTelemetry').on('click', function() {
    if (window.telemetry) {
      window.telemetry.trackInteraction('button', 'showTelemetry', 'clicked');
      updateTelemetryDashboard();
      $('#telemetryDashboard').fadeIn();
    }
  });
  
  $('#closeTelemetry').on('click', function() {
    if (window.telemetry) {
      window.telemetry.trackInteraction('button', 'closeTelemetry', 'clicked');
    }
    $('#telemetryDashboard').fadeOut();
  });
  
  setInterval(function() {
    if ($('#telemetryDashboard').is(':visible')) {
      updateTelemetryDashboard();
    }
  }, 5000);
}

function updateTelemetryDashboard() {
  if (!window.telemetry) return;
  
  const stats = window.telemetry.getStats();
  const report = window.telemetry.generateReport();
  
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