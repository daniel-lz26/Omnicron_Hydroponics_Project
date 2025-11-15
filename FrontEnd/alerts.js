// ---------------------------------------
// SYSTEM ALERTS MONITORING
// ---------------------------------------
const API_BASE_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';

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

  // Check Water Level
  if (data.water_level < THRESHOLDS.water.critical) {
    newAlerts.push({
      id: 'water-critical',
      type: 'critical',
      icon: '🚨',
      title: 'CRITICAL: OUT OF WATER',
      message: `Water level: ${data.water_level.toFixed(1)}% - Refill immediately!`,
      value: data.water_level
    });
  } else if (data.water_level < THRESHOLDS.water.warning) {
    newAlerts.push({
      id: 'water-warning',
      type: 'warning',
      icon: '⚠️',
      title: 'Low Water Level',
      message: `Water level: ${data.water_level.toFixed(1)}% - Consider refilling soon`,
      value: data.water_level
    });
  }

  // Check PPM (Nutrient Level)
  if (data.nutrient_level < THRESHOLDS.ppm.criticalLow) {
    newAlerts.push({
      id: 'ppm-critical-low',
      type: 'critical',
      icon: '🚨',
      title: 'CRITICAL: PPM Too Low',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Add nutrients immediately!`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level < THRESHOLDS.ppm.min) {
    newAlerts.push({
      id: 'ppm-warning-low',
      type: 'warning',
      icon: '⚠️',
      title: 'Low PPM',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Consider adding nutrients`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level > THRESHOLDS.ppm.criticalHigh) {
    newAlerts.push({
      id: 'ppm-critical-high',
      type: 'critical',
      icon: '🚨',
      title: 'CRITICAL: PPM Too High',
      message: `PPM: ${data.nutrient_level.toFixed(0)} ppm - Dilute solution immediately!`,
      value: data.nutrient_level
    });
  } else if (data.nutrient_level > THRESHOLDS.ppm.max) {
    newAlerts.push({
      id: 'ppm-warning-high',
      type: 'warning',
      icon: '⚠️',
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
      icon: '🚨',
      title: 'CRITICAL: pH Too Low (Acidic)',
      message: `pH: ${data.ph_level.toFixed(2)} - Adjust pH immediately!`,
      value: data.ph_level
    });
  } else if (data.ph_level < THRESHOLDS.ph.min) {
    newAlerts.push({
      id: 'ph-warning-low',
      type: 'warning',
      icon: '⚠️',
      title: 'pH Too Low',
      message: `pH: ${data.ph_level.toFixed(2)} - Consider adjusting pH`,
      value: data.ph_level
    });
  } else if (data.ph_level > THRESHOLDS.ph.criticalHigh) {
    newAlerts.push({
      id: 'ph-critical-high',
      type: 'critical',
      icon: '🚨',
      title: 'CRITICAL: pH Too High (Alkaline)',
      message: `pH: ${data.ph_level.toFixed(2)} - Adjust pH immediately!`,
      value: data.ph_level
    });
  } else if (data.ph_level > THRESHOLDS.ph.max) {
    newAlerts.push({
      id: 'ph-warning-high',
      type: 'warning',
      icon: '⚠️',
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
        <span class="checkmark">✓</span> All systems normal
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
    const response = await fetch(`${API_BASE_URL}/readings/latest`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for alerts
    const alerts = checkAlerts(data);

    // Update display
    updateAlertsDisplay(alerts);

    // Log to console for debugging
    console.log(`📊 Alert Check: ${alerts.length} active alert(s)`, {
      water: data.water_level,
      ppm: data.nutrient_level,
      ph: data.ph_level
    });

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
