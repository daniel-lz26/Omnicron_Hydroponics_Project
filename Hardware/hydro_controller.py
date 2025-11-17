# CODE IN PI 
# FOR REFERENCE ONLY
# """
# Hydro Controller
# Runs pump cycles even without WiFi. Sends data to backend API if available.
# """

# import time
# from datetime import datetime
# import os
# import requests

# from pump_test_V2 import pump_on, pump_off
# import RPi.GPIO as GPIO
# import board, busio
# from adafruit_ads1x15 import ads1115 as ADS
# from adafruit_ads1x15.analog_in import AnalogIn

# # ====== CONFIG ======
# PUMP_ON_SECONDS = 30           # pump run duration
# PUMP_INTERVAL_HOURS = 3        # pump repeat interval
# BOOT_DELAY_SECONDS = 20        # wait after powering Pi

# ADS_GAIN = 2/3
# ADS_ADDR = 0x48

# BACKEND_URL = os.getenv("BACKEND_URL", "https://omnicronhydroponicsproject-production.up.railway.app")


# # ====== SEND TO BACKEND (IF WIFI AVAIL)
# def send_reading(ph_val: float, water_lvl: float, tds_val: float):
#     payload = {
#         "water_level": float(water_lvl),
#         "nutrient_level": float(tds_val),
#         "ph_level": float(ph_val)
#     }
#     try:
#         r = requests.post(f"{BACKEND_URL}/readings/", json=payload, timeout=5)
#         if r.status_code == 200:
#             print("Sent to backend:", r.json())
#         else:
#             print("Backend returned error:", r.status_code, r.text)
#     except Exception:
#         print("No WiFi — running offline mode.")


# # ==== SETUP ADS SENSOR ====
# i2c = busio.I2C(board.SCL, board.SDA)
# ads = ADS.ADS1115(i2c, address=ADS_ADDR, gain=ADS_GAIN)

# chan_ph = AnalogIn(ads, 1)
# chan_water = AnalogIn(ads, 2)
# chan_tds = AnalogIn(ads, 3)


# # ==== SENSOR CONVERSION ====
# def convert_ph(voltage):
#     return round(7 + (2.5 - voltage) * 3.0, 2)

# def convert_water_level(voltage):
#     return round((voltage / 3.3) * 100, 1)

# def convert_tds(voltage):
#     return round(voltage * 500, 1)


# # ====== MAIN LOOP ======
# try:
#     print("Booting... waiting 20 seconds before first pump.")
#     time.sleep(BOOT_DELAY_SECONDS)

#     # Force pump cycle to run once at boot
#     last_pump_time = time.time() - (PUMP_INTERVAL_HOURS * 3600)

#     while True:
#         # READ SENSOR VALUES
#         ph_val = convert_ph(chan_ph.voltage)
#         water_lvl = convert_water_level(chan_water.voltage)
#         tds_val = convert_tds(chan_tds.voltage)

#         print(f"\n[{datetime.now().strftime('%H:%M:%S')}]")
#         print(f"  pH: {ph_val}")
#         print(f"  Water Level: {water_lvl}%")
#         print(f"  TDS: {tds_val} ppm")

#         # SEND TO BACKEND IF ONLINE
#         send_reading(ph_val, water_lvl, tds_val)

#         # OFFLINE/ONLINE TIMED PUMP CONTROL
#         now = time.time()
#         hours_since_last = (now - last_pump_time) / 3600

#         if hours_since_last >= PUMP_INTERVAL_HOURS:
#             print(f"Pump cycle triggered. Running for {PUMP_ON_SECONDS} seconds...")
#             pump_on()
#             time.sleep(PUMP_ON_SECONDS)
#             pump_off()
#             print("Pump cycle complete.")
#             last_pump_time = time.time()

#         time.sleep(5)

# except KeyboardInterrupt:
#     print("\nManual stop received. Cleaning up...")

# finally:
#     GPIO.cleanup()
#     print("GPIO cleaned up. Program ended.")



