// Pump Control Functions
const API_URL = 'https://omnicronhydroponicsproject-production.up.railway.app';

async function controlPump(action) {
  const statusDiv = document.getElementById('pump-control-status');
  const onBtn = document.querySelector('.pump-on-btn');
  const offBtn = document.querySelector('.pump-off-btn');

  try {
    // Disable buttons during request
    if (onBtn) onBtn.disabled = true;
    if (offBtn) offBtn.disabled = true;

    statusDiv.textContent = `Sending command...`;
    statusDiv.className = 'pump-status-text status-loading';

    // Call API
    const response = await fetch(`${API_URL}/pump/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Show success
    statusDiv.textContent = `Pump turned ${action.toUpperCase()} successfully!`;
    statusDiv.className = 'pump-status-text status-success';

    console.log(`✓ Pump ${action}:`, data);

  } catch (error) {
    // Show error
    statusDiv.textContent = `Error: ${error.message}`;
    statusDiv.className = 'pump-status-text status-error';

    console.error(`✗ Pump control error:`, error);

  } finally {
    // Re-enable buttons
    if (onBtn) onBtn.disabled = false;
    if (offBtn) offBtn.disabled = false;

    // Clear status after 3 seconds
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'pump-status-text';
    }, 3000);
  }
}

// Make function globally available
window.controlPump = controlPump;
