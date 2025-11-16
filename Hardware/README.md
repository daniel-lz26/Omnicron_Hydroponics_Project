#  Omnicron Hydroponics - Raspberry Pi Controller

Automated hydroponic system controller that manages pump cycles, reads sensor data, and sends telemetry to the cloud backend.

##  Table of Contents
- [Hardware Requirements](#hardware-requirements)
- [Software Requirements](#software-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Auto-Start Setup](#auto-start-setup)
- [Troubleshooting](#troubleshooting)

---

##  Hardware Requirements

- **Raspberry Pi** (3/4/Zero W recommended)
- **ADS1115 ADC** (Analog-to-Digital Converter)
- **Relay Module** (for pump control, connected to GPIO 17)
- **Sensors:**
  - pH Sensor (connected to ADS1115 Channel 1)
  - Water Level Sensor (connected to ADS1115 Channel 2)
  - TDS Sensor (connected to ADS1115 Channel 3)
- **Water Pump** (controlled via relay)

### Wiring Diagram
```
ADS1115 ADC:
- VDD  → 3.3V
- GND  → Ground
- SCL  → GPIO 3 (SCL)
- SDA  → GPIO 2 (SDA)
- A1   → pH Sensor
- A2   → Water Level Sensor
- A3   → TDS Sensor

Relay Module:
- VCC  → 5V
- GND  → Ground
- IN   → GPIO 17
- COM/NO → Pump Power
```

---

##  Software Requirements

### System Packages
```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-dev git i2c-tools
```

### Python Libraries
```bash
pip3 install --break-system-packages adafruit-circuitpython-ads1x15
pip3 install --break-system-packages requests
pip3 install --break-system-packages RPi.GPIO
```

### Enable I2C
```bash
sudo raspi-config
# Navigate to: Interface Options → I2C → Enable
sudo reboot
```

Verify I2C:
```bash
i2cdetect -y 1
# Should show device at address 0x48
```

---

##  File Structure
```
~/Desktop/Omicron_Hyrdro/Hardware/
├── hydro_controller.py    # Main control script
└── pump_test_V2.py        # Pump control module
```

---

##  Installation

### 1. Clone Repository
```bash
cd ~/Desktop
git clone https://github.com/daniel-lz26/Omnicron_Hydroponics_Project.git
cd Omnicron_Hydroponics_Project/Hardware
```

### 2. Test Hardware Connections

**Test I2C Communication:**
```bash
i2cdetect -y 1
```

**Test Pump Control:**
```bash
python3 pump_test_V2.py
# Commands: 'on', 'off', 'pulse <seconds>', 'exit'
```

### 3. Configure Backend URL

Edit `hydro_controller.py` if needed:
```python
BACKEND_URL = "https://omnicronhydroponicsproject-production.up.railway.app"
```

Or set environment variable:
```bash
export BACKEND_URL="https://your-backend-url.com"
```

---

## ⚙️ Configuration

### Pump Settings

Edit `hydro_controller.py`:
```python
PUMP_ON_SECONDS = 30          # Pump runtime per cycle (seconds)
PUMP_INTERVAL_HOURS = 3       # Time between pump cycles (hours)
BOOT_DELAY_SECONDS = 20       # Delay before first pump on boot
```

### Sensor Calibration

Adjust conversion functions in `hydro_controller.py`:
```python
def convert_ph(voltage):
    # Customize based on your pH sensor calibration
    return round(7 + (2.5 - voltage) * 3.0, 2)

def convert_water_level(voltage):
    # Linear mapping: 0V = 0%, 3.3V = 100%
    return round((voltage / 3.3) * 100, 1)

def convert_tds(voltage):
    # Customize based on your TDS sensor
    return round(voltage * 500, 1)
```

---

##  Usage

### Manual Run (Testing)
```bash
cd ~/Desktop/Omicron_Hyrdro/Hardware
python3 hydro_controller.py
```

**Expected Output:**
```
Booting... waiting 20 seconds before first pump.
[HH:MM:SS]
  pH: 7.2
  Water Level: 65.3%
  TDS: 842.5 ppm
  
Running pump for 30 seconds...
Pump turned ON
Pump turned OFF
Sent to backend: {'id': 123, 'timestamp': '...'}
```

### Stop Script
Press `Ctrl+C` to stop gracefully. GPIO will be cleaned up automatically.

---

## 🔄 Auto-Start Setup

Make the script run automatically on boot:

### 1. Create Systemd Service
```bash
sudo nano /etc/systemd/system/hydro.service
```

Paste this configuration:
```ini
[Unit]
Description=Hydroponic Sensor Monitor and Pump Controller
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=eunk
WorkingDirectory=/home/eunk/Desktop/Omicron_Hyrdro/Hardware
ExecStart=/usr/bin/python3 /home/eunk/Desktop/Omicron_Hyrdro/Hardware/hydro_controller.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 2. Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable hydro.service

# Start service now
sudo systemctl start hydro.service

# Check status
sudo systemctl status hydro.service
```

### 3. Useful Service Commands
```bash
# View live logs
journalctl -u hydro.service -f

# View last 50 lines
journalctl -u hydro.service -n 50

# Restart service
sudo systemctl restart hydro.service

# Stop service
sudo systemctl stop hydro.service

# Disable auto-start
sudo systemctl disable hydro.service
```

---

## 🛠️ Troubleshooting

### Issue: "No module named 'adafruit_ads1x15'"

**Solution:**
```bash
pip3 install --break-system-packages adafruit-circuitpython-ads1x15
```

### Issue: "I2C device not found"

**Solution:**
1. Check wiring (SDA, SCL, VDD, GND)
2. Enable I2C: `sudo raspi-config` → Interface Options → I2C
3. Verify: `i2cdetect -y 1`

### Issue: Pump doesn't turn on

**Solution:**
1. Test relay manually: `python3 pump_test_V2.py`
2. Check relay wiring to GPIO 17
3. Verify relay is active-low (most are)
4. Check pump power supply

### Issue: "Backend unreachable"

**Solution:**
- Script works offline! Data just won't be sent to cloud
- Check WiFi: `ping google.com`
- Verify backend URL is correct
- Check Railway deployment status

### Issue: Service won't start

**Solution:**
```bash
# Check logs for errors
journalctl -u hydro.service -n 50

# Verify file paths in service file
sudo nano /etc/systemd/system/hydro.service

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart hydro.service
```

### Issue: Sensors reading 0 or garbage values

**Solution:**
1. Check sensor connections to ADS1115
2. Verify sensor power (usually 5V or 3.3V)
3. Calibrate conversion functions
4. Test with multimeter on sensor outputs

---

##  Features

 **Offline-Compatible** - Runs pump cycles without internet
 **Auto-Recovery** - Restarts automatically if crash occurs  
 **Cloud Telemetry** - Sends data to Railway backend when online
 **Scheduled Pumping** - Runs every 3 hours for 30 seconds
 **Boot Delay** - Waits 20 seconds before first pump cycle
 **Real-time Monitoring** - Reads pH, TDS, water level every 2 seconds

---

##  File Descriptions

### `hydro_controller.py`
Main control script that:
- Reads sensor data from ADS1115
- Controls pump via relay
- Sends data to cloud backend
- Runs scheduled pump cycles

### `pump_test_V2.py`
Pump control module with:
- `pump_on()` - Turn pump on
- `pump_off()` - Turn pump off
- `pump_pulse(seconds)` - Run pump for specified duration
- CLI mode for manual testing
**Last Updated:** November 2025
