import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c, address = 0x48)
ads.gain = 1

#Use numeric channel indices instead of ADS.P0-ADS.P3
A0 = AnalogIn(ads, 0)
A1 = AnalogIn(ads, 1)
A2 = AnalogIn(ads, 2)
A3 = AnalogIn(ads, 3)

print('\nReading ADS Sensors')

try:
    while True:
        print(
            f"unused: {A0.voltage:.3f} V | "
            f"PH: {A1.voltage:.3f} V| "
            f"Water Level: {A2.voltaage:.3f} | V"
            f"IDS: {A3.voltage:.3f} V"
        )
        time.sleep(0.5)
except KeyboardInterrupt:
    print("\nStopped reading sensors.")