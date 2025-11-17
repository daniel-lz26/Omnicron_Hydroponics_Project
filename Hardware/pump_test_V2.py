# THESE FILES ARE IN THE PI
# THEY ARE HERE FOR REFERENCE ONLY

# #!/usr/bin/env python3
# # -*- coding: utf-8 -*-
# """
# pump_test_V2.py
# - Initializes one relay output for a pump
# - Exposes pump_on() / pump_off() functions for other modules to import
# - If run directly, provides a tiny CLI: type 'on', 'off', 'exit'
# """

# import time
# import RPi.GPIO as GPIO

# # ====== CONFIG ======
# RELAY_PIN = 17          # BCM pin number connected to your relay IN
# ACTIVE_LOW = True       # Most relay boards are active-low (LOW = ON)

# # ====== GPIO SETUP ======
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.HIGH if ACTIVE_LOW else GPIO.LOW)

# def _relay_write(on: bool):
#     """Drive the relay pin respecting ACTIVE_LOW logic."""
#     if ACTIVE_LOW:
#         GPIO.output(RELAY_PIN, GPIO.LOW if on else GPIO.HIGH)
#     else:
#         GPIO.output(RELAY_PIN, GPIO.HIGH if on else GPIO.LOW)

# # ====== PUBLIC API ======
# def pump_on():
#     """Turn pump ON."""
#     _relay_write(True)
#     print("Pump turned ON")

# def pump_off():
#     """Turn pump OFF."""
#     _relay_write(False)
#     print("Pump turned OFF")

# def pump_pulse(seconds: float = 2.0):
#     """Run pump for a short burst, then turn it off."""
#     pump_on()
#     time.sleep(max(0.0, seconds))
#     pump_off()

# # ====== SELF-TEST CLI ======
# def _cli():
#     print("Pump control ready. Commands: 'on', 'off', 'pulse <sec>', 'exit'")
#     try:
#         while True:
#             cmd = input("> ").strip().lower()
#             if cmd == "on":
#                 pump_on()
#             elif cmd == "off":
#                 pump_off()
#             elif cmd.startswith("pulse"):
#                 parts = cmd.split()
#                 dur = float(parts[1]) if len(parts) > 1 else 2.0
#                 pump_pulse(dur)
#             elif cmd == "exit":
#                 break
#             elif cmd == "":
#                 continue
#             else:
#                 print("Unknown command. Try: on | off | pulse <sec> | exit")
#             time.sleep(0.1)
#     finally:
#         GPIO.cleanup()
#         print("GPIO cleaned up. Program ended.")

# if __name__ == "__main__":
#     _cli()

