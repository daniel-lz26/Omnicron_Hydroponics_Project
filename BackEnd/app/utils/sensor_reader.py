#Utils File

# Ezra Gale Noah Abass
# create alerts for the sensors and when they are too low
# water level, ph level, nutrient level, give time of when alert goes off

from datetime import datetime

def water_alert(water_level): 
    if water_level <= 20: #random number will replace
        alert_time = datetime.now()
        print(f"Water level low ({water_level}) at {alert_time}")
        return {"type": "water", "level": water_level, "time": alert_time}
    
def ph_alert(ph_level): 
    if ph_level <= 5.7:
        alert_time = datetime.now()
        print(f"Ph level low ({ph_level}) at {alert_time}")
        return {"type": "Ph", "level": ph_level, "time": alert_time}

def nutrient_alert(nutrient_level): 
    if nutrient_level <= 700:
        alert_time = datetime.now()
        print(f"Nutrient level low ({nutrient_level}) at {alert_time}")
        return {"type": "Nutrient", "level": nutrient_level, "time": alert_time}
    elif nutrient_level > 800: 
        alert_time = datetime.now()
        print(f"Nutrient level too high ({nutrient_level}) at {alert_time}")
        return {"type": "Nutrient", "level": nutrient_level, "time": alert_time}
    
    return None