# This script will hit the API endpoint every second with a new lat long
import requests, time

lat = 30.63
long = -96.48
heading = 0

while True:
    # While the script is running, send data to the api endpoint
    url = f"http://127.0.0.1:5000/send?lat={lat}&long={long}&heading={heading}"
    response = requests.get(url)

    # Update the position
    lat += 0.005
    long += 0.005
    heading += 15

    # Repeat every second
    time.sleep(1.5)