// ---------------------------------------
// SYSTEM ALERTS MONITORING
// ---------------------------------------
// Note: API_BASE_URL is defined in charts.js (loaded first)

// Alert thresholds
const THRESHOLDS = {
  water: {
    critical: 7,      // Below 7% = OUT OF WATER
    warning: 20       // Below 20% = LOW WATER WARNING
  },
  ppm: {
    min: 500,         // Below 500 = TOO LOW
    max: 1400,        // Above 1400 = TOO HIGH
    criticalLow: 300, // Below 300 = CRITICALLY LOW
    criticalHigh: 1800 // Above 1800 = CRITICALLY HIGH
  },
  ph: {
    min: 5.5,         // Below 5.5 = TOO ACIDIC
    max: 7.5,         // Above 7.5 = TOO ALKALINE
    criticalLow: 5.0,
    criticalHigh: 8.0
  }
};

// Store active alerts
let activeAlerts = new Set();

// Check sensor values and generate alerts
function checkAlerts(data) {
  const newAlerts = [];

  // Debug logging
  console.log('🔍 Checking alerts with data:', {
    water_level: data.water_level,
    nutrient_level: data.nutrient_level,
    ph_level: data.ph_level
  });

  // Check Water Level - EXPLICIT CHECK
  const waterLevel = parseFloat(data.water_level);

  if (waterLevel < THRESHOLDS.water.critical) {
    newAlerts.push({
      id: 'water-critical',
      type: 'critical',
      icon: '',
      title: 'CRITICAL: NO WATER DETECTED',
      message: `Water level is at ${waterLevel.toFixed(1)}% - System needs water immediately!`,
      value: waterLevel
    });
    console.log('CRITICAL ALERT: NO WATER!');
  } else if (waterLevel < THRESHOLDS.water.warning) {
    newAlerts.push({
      id: 'water-warning',
      type: 'warning',
      icon: '',
      title: 'Low Water Level',
      message: `Water level: ${waterLevel.toFixed(1)}% - Consider refilling soon`,
      value: waterLevel
    });
    console.log('WARNING: Low water');
  }

  // Check PPM (Nutrient Level)
  if (data.nutrient_level < THRESHOLDS.ppm.criticalLow) {
    newAlerts.push({
      id: 'ppm-critical-low',
      type: 'critical',
      icon: '',
      title: 'CRITICAL: PPM Too Low',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Add nutrients immediately!`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level < THRESHOLDS.ppm.min) {
    newAlerts.push({
      id: 'ppm-warning-low',
      type: 'warning',
      icon: '',
      title: 'Low PPM',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Consider adding nutrients`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level > THRESHOLDS.ppm.criticalHigh) {
    newAlerts.push({
      id: 'ppm-critical-high',
      type: 'critical',
      icon: '',
      title: 'CRITICAL: PPM Too High',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Dilute solution immediately!`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level > THRESHOLDS.ppm.max) {
    newAlerts.push({
      id: 'ppm-warning-high',
      type: 'warning',
      icon: '',
      title: 'High PPM',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Consider diluting solution`,
      value: data.nutrient_level
    });
  }

  // Check pH (optional - can be enabled)
  if (data.ph_level < THRESHOLDS.ph.criticalLow) {
    newAlerts.push({
      id: 'ph-critical-low',
      type: 'critical',
      icon: '',
      title: 'CRITICAL: pH Too Low (Acidic)',
      message: `pH: ${data.ph_level.toFixed(2)} - Adjust pH immediately!`,
      value: data.ph_level
    });
  } else if (data.ph_level < THRESHOLDS.ph.min) {
    newAlerts.push({
      id: 'ph-warning-low',
      type: 'warning',
      icon: '',
      title: 'pH Too Low',
      message: `pH: ${data.ph_level.toFixed(2)} - Consider adjusting pH`,
      value: data.ph_level
    });
  } else if (data.ph_level > THRESHOLDS.ph.criticalHigh) {
    newAlerts.push({
      id: 'ph-critical-high',
      type: 'critical',
      icon: '',
      title: 'CRITICAL: pH Too High (Alkaline)',
      message: `pH: ${data.ph_level.toFixed(2)} - Adjust pH immediately!`,
      value: data.ph_level
    });
  } else if (data.ph_level > THRESHOLDS.ph.max) {
    newAlerts.push({
      id: 'ph-warning-high',
      type: 'warning',
      icon: '',
      title: 'pH Too High',
      message: `pH: ${data.ph_level.toFixed(2)} - Consider adjusting pH`,
      value: data.ph_level
    });
  }

  return newAlerts;
}

// Update alerts display
function updateAlertsDisplay(alerts) {
  const alertsList = document.getElementById('alerts-list');

  if (!alertsList) {
    console.warn('Alerts list element not found');
    return;
  }

  // Clear current alerts
  alertsList.innerHTML = '';

  if (alerts.length === 0) {
    // Show "all systems normal" message
    alertsList.innerHTML = `
      <div class="alert-placeholder">
        All systems normal
      </div>
    `;
    activeAlerts.clear();
  } else {
    // Show alerts
    alerts.forEach(alert => {
      const alertElement = document.createElement('div');
      alertElement.className = `alert alert-${alert.type}`;
      alertElement.id = alert.id;

      alertElement.innerHTML = `
        <div class="alert-icon">${alert.icon}</div>
        <div class="alert-content">
          <div class="alert-title">${alert.title}</div>
          <div class="alert-message">${alert.message}</div>
        </div>
      `;

      alertsList.appendChild(alertElement);

      // Track active alerts
      if (!activeAlerts.has(alert.id)) {
        activeAlerts.add(alert.id);
        console.log(`🚨 NEW ALERT: ${alert.title} - ${alert.message}`);
      }
    });
  }
}

// Fetch latest reading and check for alerts
async function monitorSystemAlerts() {
  try {
    // Get sensor readings
    const response = await fetch(`${API_BASE_URL}/readings/latest`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Get pump status
    let pumpStatus = null;
    try {
      const pumpResponse = await fetch(`${API_BASE_URL}/pump/status`);
      if (pumpResponse.ok) {
        pumpStatus = await pumpResponse.json();
      }
    } catch (e) {
      console.warn('Could not fetch pump status:', e);
    }

    // Check for alerts
    const alerts = checkAlerts(data);

    // Add pump status alert if pump is running
    if (pumpStatus && pumpStatus.status === 'on') {
      alerts.unshift({
        id: 'pump-running',
        type: 'info',
        icon: '',
        title: 'Pump Active',
        message: `Pump is currently running - Last activated: ${new Date(pumpStatus.last_updated).toLocaleTimeString()}`,
        value: 'on'
      });
    }

    // Update display
    updateAlertsDisplay(alerts);

    // Log to console for debugging
    console.log(`📊 Alert Check Complete:`, {
      totalAlerts: alerts.length,
      water_level: data.water_level + '%',
      ppm: data.nutrient_level,
      ph: data.ph_level,
      alerts: alerts.map(a => a.title)
    });

    if (alerts.length > 0) {
      console.log('⚠️ ACTIVE ALERTS:', alerts);
    }

  } catch (error) {
    console.error('❌ Error checking alerts:', error);
  }
}

// Initialize alerts system
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔔 Alerts system initialized');

  // Initial check
  monitorSystemAlerts();

  // Check every 30 seconds
  setInterval(monitorSystemAlerts, 30000);
});
