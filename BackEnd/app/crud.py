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
    new_reading = ProbeReading(**reading.dict())                                #turns the probe reading into python 
    db.add(new_reading)                                                         #adds reading into SESSION NOT DATABASE
    db.commit()                                                                 #adds reading to database
    db.refresh(new_reading)                                                     #fetches the id into database for reading
    return new_reading                                                          #Summary: We are creating a new row for our readings in our database and giving it an id 

# READ FUNCTIONS


def get_all_readings(db: Session):
    return db.query(ProbeReading).all()

def get_reading_by_id(db: Session, reading_id: int):
    return db.query(ProbeReading).filter(ProbeReading.id == reading_id).first()
            #gets readings        #gets readings by id                  


def get_latest_reading(db: Session):
        return db.query(ProbeReading).order_by(ProbeReading.timestamp.desc()).first()
            #gets the all readings     #finds the most recent timestamp 
    #Summary: Gets all the readings and all the times stamps then puts the timestamps in order from most latest 
    #to earliest and picks the first one


def get_readings_by_date_range(db: Session, startDate: datetime, endDate: datetime):
    return db.query(ProbeReading).filter(                       #gets a column from database
        ProbeReading.timestamp >= startDate,                    #gets the timestamps greater than or equal to the start date
        ProbeReading.timestamp <= endDate                       #gets the timestamps less than or equal to the end date
    ).order_by(ProbeReading.timestamp.desc()).all()             #orders them from start to end
                                                                #Note: the , is "and"


def get_low_ph_readings(db: Session, ph_thresh: float = 6.5 , limit: int = 10 ):
    return db.query(ProbeReading).ph_level(                         #gets the ph levels from the data base
        ProbeReading.ph_level <= ph_thresh                          #return if the ph level is less than the ph threshold
    ).order_by(ProbeReading.timestamp.desc()).limit(limit).all()    #order by time and shows 10 rows
                                                                    #Summary: for the most recent ph levels we recorded, 
                                                                    #if it is less than 6.5 this function will detect it and display it


def get_water_level_alerts(id, water_level, nutrient_level, ph_level, timestamp):
    pass

# UPDATE FUNCTIONS
# imagine we wanna change something from a table row


def update_reading():
    pass

# DELETE FUNCTIONS
# we wanna delete rows and old rows after a ceratin day because we cant hold old data forever


def delete_reading():
    pass


def delete_old_readings():
    pass

# STATS
# for functions like average ph, tds, etc
