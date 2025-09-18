from flask import Flask, render_template, jsonify, request
import sqlite3, requests, json

# CONST: Script2
testJSON18 = "scripts/testDUSKY18.json"
initLat18 = 30.69090205309053
initLong18 = -96.40085356970247
initHeading18 = 30.61
initAlt18 = 15.43
initAirspd18 = 19.82
testJSON21 = "scripts/testDUSKY21.json"
initLat21 = 30.57790205309053
initLong21 = -96.35085356970247
initHeading21 = 140.61
initAlt21 = 82.31
initAirspd21 = 21.82
testJSON24 = "scripts/testDUSKY24.json"
initLat24 = 30.6821
initLong24 = -96.2624
initHeading24 = 120.31
initAlt24 = 34.53
initAirspd24 = 34.21
testJSON27 = "scripts/testDUSKY27.json"
initLat27 = 30.6384
initLong27 = -96.4388
initHeading27 = 240.92
initAlt27 = 77.83
initAirspd27 = 31.65

testFiles = [testJSON18, testJSON21, testJSON24, testJSON27]
initVals18 = [initLat18, initLong18, initHeading18, initAlt18, initAirspd18]
initVals21 = [initLat21, initLong21, initHeading21, initAlt21, initAirspd21]
initVals24 = [initLat24, initLong24, initHeading24, initAlt24, initAirspd24]
initVals27 = [initLat27, initLong27, initHeading27, initAlt27, initAirspd27]


# Initialize App Object
app = Flask(__name__)


# Connect and initialize DB in it's own connection
# We have lat and long and then our id is tracked for the map and markers
with sqlite3.connect('database.db') as con:
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS points(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            callsign TEXT,
            lat REAL,
            long REAL,
            heading REAL,
            alt REAL,
            airSpeed REAL
        )
    """)
    con.commit()


# Home
@app.route("/")
def home():
    return render_template('home.html')


# API Endpoint, where the data gets sent to and the point gets put into the DB
# Calling out to the api looks like this: http://127.0.0.1:5000/send?classign=DUSKY18&lat=30.63&long=-96.48&heading=142.34&alt=32.21
@app.route("/send")
def send():
    callsign = request.args.get("callsign", type=str)
    lat = request.args.get("lat", type=float)
    long = request.args.get("long", type=float)
    heading = request.args.get("heading", type=float)
    alt = request.args.get("alt", type=float)
    airSpeed = request.args.get("airSpeed", type=float)

    if callsign is not None and lat is not None and long is not None and heading is not None and alt is not None and airSpeed is not None:
        # Inserting into DB, it's own connection
        with sqlite3.connect('database.db') as con:
            cur = con.cursor()
            cur.execute("INSERT INTO points(callsign, lat, long, heading, alt, airSpeed) VALUES (?, ?, ?, ?, ?, ?)", 
                        (callsign, lat, long, heading, alt, airSpeed))
            con.commit()

        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Error with inputting values into db from URL"})
    

# Pulling information out of the DB for use
@app.route("/list")
def list():
    last = request.args.get("last", default=0, type=int)
    
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("SELECT id, callsign, lat, long, heading FROM points WHERE id > ?", (last,))
        rows = cur.fetchall()
        
        markers = [{"id": row[0], "callsign": row[1], "lat": row[2], "long": row[3], "heading": row[4]} for row in rows]

    return jsonify(markers)


# Grab the last tracked ALTITUDE from each plane out of the db
@app.route("/lastAlt")
def lastAlt():
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("""
            SELECT callsign, alt
            FROM points
            ORDER BY id DESC
            LIMIT 4
        """)
        rows = cur.fetchall()
        rows.reverse()          # This gives the data in DUSKY 18, 21, 24, and 27 format instead of flipped

        altitudes = [
            {"callsign": row[0], "alt": row[1]}
            for row in rows
        ]

    return jsonify(altitudes)


# Grab the last tracked AIR SPEED from each plane out of the db
@app.route("/lastAirSpd")
def lastAirSpd():
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("""
            SELECT callsign, airSpeed
            FROM points
            ORDER BY id DESC
            LIMIT 4
        """)
        rows = cur.fetchall()
        rows.reverse()

        airSpeeds = [
            {"callsign": row[0], "airSpeed": row[1]}
            for row in rows
        ]

    return jsonify(airSpeeds)


# Clear DB
@app.route("/clearDB", methods=['POST'])
def clearDB():
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute("DELETE FROM points")
        con.commit()
    
    return jsonify({"status": "success"})


# This route is called on click of the S2 button
@app.route("/script2", methods=['POST'])
def script2():
    global testFiles

    # Send both our test JSON files to the jsonEnd end point
    url = "http://127.0.0.1:5000/jsonEnd"
    for file in testFiles:
        with open(file, "rb") as f:
            # This send our full file, key is file and value is an object
            files = {"file": f}
            requests.post(url, files=files)

    # Read the data from the file, store it, modify defined values, then re-store them
    for file in testFiles:
        with open(file, "r") as f:
            data = json.load(f)

        # Update the values for the next go around
        data["position"]["latitude"] = round((data["position"]["latitude"] + 0.0005), 4)
        data["position"]["longitude"] = round((data["position"]["longitude"] + 0.0005), 4)
        data["orientation"]["yaw"] = round((data["orientation"]["yaw"] + 5), 2)
        data["position"]["altitude"] = round((data["position"]["altitude"] + 7.83), 4)
        data["velocity"]["airspeed"] = round((data["velocity"]["airspeed"] + 5), 4)

        # Delete the old values and replace with our incremeneted ones
        with open(file, "w") as f:
            json.dump(data, f, indent=4)

    return jsonify({"status": "success"})


# This resets our Script2 JSON file initial values back to normal
@app.route("/script2/reset", methods=['POST'])
def script2Reset():
    global testFiles, initVals18, initVals21, initVals24, initVals27

    # Read in the file contents, save them as an object
    for file in testFiles:
        with open(file, "r") as f:
            data = json.load(f)

        # Reset these values back to pre-defined defaults
        match data["call_sign"]:
            case "DUSKY18":
                data["position"]["latitude"] = initVals18[0]
                data["position"]["longitude"] = initVals18[1]
                data["orientation"]["yaw"] = initVals18[2]
                data["position"]["altitude"] = initVals18[3]
                data["velocity"]["airspeed"] = initVals18[4]
            case "DUSKY21":
                data["position"]["latitude"] = initVals21[0]
                data["position"]["longitude"] = initVals21[1]
                data["orientation"]["yaw"] = initVals21[2]
                data["position"]["altitude"] = initVals21[3]
                data["velocity"]["airspeed"] = initVals21[4]
            case "DUSKY24":
                data["position"]["latitude"] = initVals24[0]
                data["position"]["longitude"] = initVals24[1]
                data["orientation"]["yaw"] = initVals24[2]
                data["position"]["altitude"] = initVals24[3]
                data["velocity"]["airspeed"] = initVals24[4]
            case "DUSKY27":
                data["position"]["latitude"] = initVals27[0]
                data["position"]["longitude"] = initVals27[1]
                data["orientation"]["yaw"] = initVals27[2]
                data["position"]["altitude"] = initVals27[3]
                data["velocity"]["airspeed"] = initVals27[4]
        
        # Write the newly reset values to their respective files
        with open(file, "w") as f:
            json.dump(data, f, indent=4)

    return jsonify({"status": "success"})


# This endpoint accepts JSON files as input, parses them, then sends it off to the API
@app.route("/jsonEnd", methods=["POST"])
def jsonEnd():
    # Accept the JSON file if it exists, return error if nothing or wrong file, etc
    if "file" not in request.files:
        return jsonify({"error": "no JSON file uploaded, or bad file"}), 400
    
    # file is the object (value) that was passed based on it's key (see script2)
    file = request.files["file"]
    data = json.load(file)
    
    # Extract values to send to API front end for making points
    callsign = data["call_sign"]
    lat = data["position"]["latitude"]
    long = data["position"]["longitude"]
    heading = data["orientation"]["yaw"]
    alt = data["position"]["altitude"]
    airSpeed = data["velocity"]["airspeed"]
    url = f"http://127.0.0.1:5000/send?callsign={callsign}&lat={lat}&long={long}&heading={heading}&alt={alt}&airSpeed={airSpeed}"
    requests.get(url)

    return jsonify({"status": "success"})


# Run the App
if __name__ == '__main__':
    app.run(debug=True)