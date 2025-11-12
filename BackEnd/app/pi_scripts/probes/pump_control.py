import RPi.GPIO as GPIO
import time

RELAY_PIN = 18  # connecting to GPIO18 (pin 12)
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)


def pump_on():
    GPIO.output(RELAY_PIN, GPIO.LOW)
    print("Pump turned ON")


def pump_off():
    GPIO.output(RELAY_PIN, GPIO.HIGH)
    print("Pump turned OFF")


if __name__ == "__main__":
    try:
        print("Testing pump control...")
        print("Turning pump ON for 5 seconds.")
        pump_on()
        time.sleep(5)
        print("Turning pump OFF.")
        pump_off()

        print("Test complete!")
    except KeyboardInterrupt:
        print("\nInterrupted by user")
    finally:
        GPIO.cleanup()
        print("GPIO cleaned up")
