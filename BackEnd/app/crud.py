from sqlalchemy.orm import Session
from models import ProbeReading
from schemas import ProbeReadingCreate
# File is for Database functions

# C - create
# R - read
# U - update
# D - delete

# CREATE FUNCTIONS
# this function creates a row in the table


def create_probe_reading(db: Session, reading: ProbeReadingCreate):
    # turns the probe reading into python
    new_reading = ProbeReading(**reading.dict())
    db.add(new_reading)  # adds reading into SESSION NOT DATABASE
    db.commit()  # adds reading to database
    db.refresh(new_reading)  # fetches the id into database for reading
    # Summary: We are creating a new row for our readings in our database and giving it an id
    return new_reading

# READ FUNCTIONS


def get_all_readings(db: Session):
    return db.query(ProbeReading).all()


def get_reading_by_id(db: Session, reading_id: int):
    return db.query(ProbeReading).filter(ProbeReading.id == reading_id).first()
    # gets readings        #gets readings by id


def get_latest_reading(db: Session):
    return db.query(ProbeReading).order_by(ProbeReading.timestamp.desc()).first()
    # gets the all readings     #finds the most recent timestamp
    # Summary: Gets all the readings and all the times stamps then puts the timestamps in order from most latest
    # to earliest and picks the first one


def get_readings_by_date_range(db: Session, startDate: datetime, endDate: datetime):
    return db.query(ProbeReading).filter(  # gets a column from database
        # gets the timestamps greater than or equal to the start date
        ProbeReading.timestamp >= startDate,
        # gets the timestamps less than or equal to the end date
        ProbeReading.timestamp <= endDate
        # orders them from start to end
    ).order_by(ProbeReading.timestamp.desc()).all()
    # Note: the , is "and"


def get_low_ph_readings(db: Session, ph_thresh: float = 6.5, limit: int = 10):
    return db.query(ProbeReading).ph_level(  # gets the ph levels from the data base
        # return if the ph level is less than the ph threshold
        ProbeReading.ph_level <= ph_thresh
        # order by time and shows 10 rows
    ).order_by(ProbeReading.timestamp.desc()).limit(limit).all()
    # Summary: for the most recent ph levels we recorded,
    # if it is less than 6.5 this function will detect it and display it


def get_water_level_alerts(db: Session, min_level: float = 10.0, max_level: float = 90.0, limit: int = 10):
    # Gets water level readings readings that are outside of the "safe range"
    # Returns readings that are too low or too high
    return db.query(ProbeReading).filter(
        (ProbeReading.water_level < min_level) |
        (ProbeReading.water_level > max_level)
    ).order_by(ProbeReading.timestamp.desc()).limit(limit).all()
    # this functions finds water levels that are either too low or too high


def get_nutrient_level_alerts(db: Session, min_level: float = 800.0, max_level: float = 1500.0, limit: int = 10):
    # gets the readings where nutrient levels are outside of the optimal range
    return db.query(ProbeReading).filter(
        (ProbeReading.nutrient_level < min_level) |
        (ProbeReading.nutrient_level > max_level)
    ).order_by(ProbeReading.timestamp.desc()).limit(limit).all()


def update_reading(db: Session, reading_id: int, water_level: float = None, nutrient_level: float = None, ph_level: float = None):
    # updates specific fields of a reading by its id
    # only updates fields that are provided
    reading = db.query(ProbeReading).filter(
        ProbeReading.id == reading_id).first()
    if not reading:
        return None

    if water_level is not None:
        reading.water_level = water_level
    if nutrient_level is not None:
        reading.nutrient_level = nutrient_level
    if ph_level is not None:
        reading.ph_level = ph_level
    db.commit()
    db.refresh(reading)
    return reading  # finds a reading by ID and updates only the values you want to change

    # DELETE FUNCTIONS
    # we wanna delete rows and old rows after a ceratin day because we cant hold old data forever

    def delete_reading():
        pass

    def delete_old_readings():
        pass

        # STATS
        # for functions like average ph, tds, etc
