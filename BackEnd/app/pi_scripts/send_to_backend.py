import requests
import datetime

API_URL =  # need clarity on this URL"


def send_reading(water_level, ph_level, nutrient_level):
    data = {
        "water_level": water_level,
        "ph_level": ph_level,
        "nutrient_level": nutrient_level,
        "timestamp": datetime.datetime.now().isoformat()
    }
    try:
        response = requests.post(API_URL, json=data)
        response.raise_for_status()
        print("Data sent successfully:", data)
    except Exception as e:
        print("Error sending data:", e)
