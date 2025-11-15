// ---------------------------------------
// DEVICE CONTROL
// ---------------------------------------
const API_BASE_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';

// Control device (pump or spray)
async function controlDevice(device, action) {
  const button = document.getElementById(`${device}-${action}-btn`);
  const statusDiv = document.getElementById(`${device}-status`);
  const statusSpan = statusDiv.querySelector('span');

  try {
    // Disable button during operation
    button.disabled = true;
    button.classList.add('loading');
    statusSpan.textContent = `${action === 'on' ? 'Turning ON...' : 'Turning OFF...'}`;

    // Make API call
    const response = await fetch(`${API_BASE_URL}/${device}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log to console for debugging
    console.log(`✅ ${device.toUpperCase()} ${action.toUpperCase()}:`, data);

    // Update status
    statusSpan.textContent = action === 'on' ? 'ON ✓' : 'OFF';
    statusSpan.className = action === 'on' ? 'status-on' : 'status-off';

    // Show success notification
    showNotification(`${device.charAt(0).toUpperCase() + device.slice(1)} turned ${action.toUpperCase()}`, 'success');

  } catch (error) {
    console.error(`❌ Error controlling ${device}:`, error);
    statusSpan.textContent = 'Error!';
    statusSpan.className = 'status-error';

    // Show error notification
    showNotification(`Failed to control ${device}: ${error.message}`, 'error');

  } finally {
    // Re-enable button
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize - Add event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Device controls initialized');

  // Optional: Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Press 'P' for pump toggle (when not typing in input)
    if (e.key === 'p' && e.target.tagName !== 'INPUT') {
      // Toggle pump (simple example)
      console.log('Keyboard shortcut: P pressed');
    }
  });
});
