import RPI.GPIO as GPIO
import time

RELAY_PIN = 18  # connecting to GPIO18 (pin 12)
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)


def pump_on():
    GPIO.output(RELAY_PIN, GPIO.LOW)
    print("Pump tured ON")


def pump_off():
    GPIO.output(RELAY_PIN, GPIO.HIGH)
    print("Pump turned OFF")


if __name__ = "__main__":
    pump_on()
    time.sleep(5)
    pump_off()
    GPIO.cleanup()
