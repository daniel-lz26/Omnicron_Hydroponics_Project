# File is for Database functions

# C - create
# R - read
# U - update
# D - delete

# CREATE FUNCTIONS
# this function creates a row in the table
def create_probe_reading(id, water_level, nutrient_level, ph_level, timestamp):
    pass
    # when ever we want to add a reading from the pi to the db
    # example: create_probe_reading(id=1, )

# READ FUNCTIONS


def get_all_readings(id, water_level, nutrient_level, ph_level, timestamp):
    pass


def get_reading_by_id(id, water_level, nutrient_level, ph_level, timestamp):
    pass


def get_latest_reading(id, water_level, nutrient_level, ph_level, timestamp):
    pass


def get_readings_by_date_range(id, water_level, nutrient_level, ph_level, timestamp):
    pass


def get_low_ph_readings(id, water_level, nutrient_level, ph_level, timestamp):
    pass


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
