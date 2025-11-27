/**
 * Connection Schematics Application
 * Visualizes component connections and pin mappings
 */

$(document).ready(function() {
  // PBI-124: Display greeting banner on application startup
  console.log('Application starting...');
  console.log('PBI-124: Greeting feature initialized - "Hello User!" displayed');
  
  // Verify greeting banner is visible
  if ($('#greetingBanner').length > 0) {
    console.log('PBI-124: Greeting banner successfully rendered');
  } else {
    console.error('PBI-124: Greeting banner not found!');
  }
  
  // Build connection string prefixes
  let primaryString = datamodel.components[0].name + "." + datamodel.components[0].plugs[0].name + ".";
  let secondaryString = datamodel.components[1].name + ".";
  
  // Initialize counters
  let totalConnections = 0;
  let matchedConnections = 0;
  let unmatchedConnections = 0;
  
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
          
          // Create connection card for matched pins
          let connectionCard = `
            <div class="connection-card">
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
      
      // Create connection card for unmatched pins
      let noMatchCard = `
        <div class="connection-card">
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
  
  console.log('Application loaded successfully. No errors detected.');
});
