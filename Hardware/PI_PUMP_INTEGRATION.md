# Raspberry Pi Pump Integration Guide

This guide shows you how to integrate the manual pump controls with your Raspberry Pi.

## What You Need to Add to `hydro_controller.py`

### 1. Import GPIO Library
Add at the top with your other imports:

```python
from gpiozero import OutputDevice
import requests
```

### 2. Configure GPIO Pin
Add after your other sensor setup:

```python
# Pump GPIO Configuration
PUMP_PIN = 17  # ⚠️ CHANGE THIS to your actual GPIO pin number
pump_relay = OutputDevice(PUMP_PIN)
pump_current_state = "off"  # Track current state to avoid redundant GPIO calls
```

### 3. Add Pump Control Function
Add this function anywhere before your main loop:

```python
def check_and_control_pump():
    """
    Poll backend for pump status and control GPIO accordingly
    """
    global pump_current_state

    try:
        # Poll the backend for current pump state
        response = requests.get(
            f"{BACKEND_URL}/pump/status",
            timeout=3,
            verify=False
        )

        if response.status_code == 200:
            data = response.json()
            requested_state = data.get("status", "off")

            # Only change GPIO if state has changed
            if requested_state != pump_current_state:
                if requested_state == "on":
                    pump_relay.on()
                    pump_current_state = "on"
                    print("🔵 PUMP ON - GPIO activated")
                    print(f"   Last updated: {data.get('last_updated')}")
                    print(f"   Requested by: {data.get('requested_by')}")

                elif requested_state == "off":
                    pump_relay.off()
                    pump_current_state = "off"
                    print("🔴 PUMP OFF - GPIO deactivated")
                    print(f"   Last updated: {data.get('last_updated')}")
                    print(f"   Requested by: {data.get('requested_by')}")

        else:
            print(f"⚠️ Failed to get pump status: HTTP {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error checking pump status: {e}")
    except Exception as e:
        print(f"⚠️ Unexpected error in pump control: {e}")
```

### 4. Add to Main Loop
In your existing main `while True:` loop, add the pump check:

```python
try:
    while True:
        # Your existing sensor reading code
        ph_val = convert_ph(chan_ph.voltage)
        water_lvl = convert_water_level(chan_water.voltage)
        tds_val = convert_tds(chan_tds.voltage)

        print(f"\n[{datetime.now().strftime('%H:%M:%S')}]")
        print(f"  pH: {ph_val}")
        print(f"  Water Level: {water_lvl}%")
        print(f"  TDS: {tds_val} ppm")

        # -------- CHECK MANUAL PUMP (NEW) --------
        check_and_control_pump()

        # -------- SEND TO BACKEND --------
        send_reading(ph_val, water_lvl, tds_val)

        # Your existing delay
        time.sleep(30)

except KeyboardInterrupt:
    print("\n👋 Shutting down...")
    pump_relay.off()  # Turn off pump on exit
    print("🔴 Pump turned OFF")
```

## How It Works

1. **Frontend**: User clicks "Pump ON" or "Pump OFF" button
2. **Backend**: `/pump/on` or `/pump/off` endpoint updates the `pump_state` dictionary
3. **Pi**: Every 30 seconds (or your loop interval), `check_and_control_pump()` polls `/pump/status`
4. **GPIO**: If state changed, Pi updates GPIO pin to turn relay ON/OFF
5. **Terminal**: You'll see pump status updates in your Pi terminal

## Expected Terminal Output

When pump is turned ON from web:
```
[10:23:45]
  pH: 6.8
  Water Level: 45.2%
  TDS: 850 ppm
🔵 PUMP ON - GPIO activated
   Last updated: 2025-11-15T10:23:44
   Requested by: web_ui
```

When pump is turned OFF from web:
```
[10:24:15]
  pH: 6.8
  Water Level: 45.3%
  TDS: 851 ppm
🔴 PUMP OFF - GPIO deactivated
   Last updated: 2025-11-15T10:24:14
   Requested by: web_ui
```

## GPIO Pin Setup

Make sure your relay is wired correctly:
- **GPIO Pin** (e.g., GPIO 17) → **Relay Signal Pin**
- **5V** → **Relay VCC**
- **GND** → **Relay GND**

## Testing Without Hardware

If you want to test without actual GPIO hardware:
```python
# Comment out the real GPIO imports
# from gpiozero import OutputDevice

# Use a mock class instead
class MockOutputDevice:
    def __init__(self, pin):
        self.pin = pin
        self.state = False

    def on(self):
        self.state = True
        print(f"   [MOCK] GPIO {self.pin} set HIGH")

    def off(self):
        self.state = False
        print(f"   [MOCK] GPIO {self.pin} set LOW")

pump_relay = MockOutputDevice(PUMP_PIN)
```

## Troubleshooting

**Pump doesn't respond:**
- Check backend URL is correct
- Verify `/pump/status` endpoint is accessible
- Check GPIO pin number matches your wiring
- Verify relay is powered and wired correctly

**State keeps switching:**
- Check for multiple Pi scripts running
- Verify only one instance of hydro_controller.py is running

**GPIO permission errors:**
- Run script with sudo: `sudo python3 hydro_controller.py`
- Or add user to gpio group: `sudo usermod -a -G gpio $USER`

## Quick Start Commands

```bash
# On your Raspberry Pi
cd ~/Omnicron_Hydroponics_Project/Hardware
python3 hydro_controller.py

# Or run in background
nohup python3 hydro_controller.py &

# View logs
tail -f nohup.out
```
