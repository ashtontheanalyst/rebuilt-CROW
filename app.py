from flask import Flask, render_template, jsonify, request
import sqlite3, requests, json

# CONST: Script2
testJSON17 = "scripts/testDUSKY17.json"
initLat17 = 30.69090205309053
initLong17 = -96.40085356970247
initHeading17 = 30.61
testJSON21 = "scripts/testDUSKY21.json"
initLat21 = 30.57790205309053
initLong21 = -96.35085356970247
initHeading21 = 140.61


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
            heading REAL
        )
    """)
    con.commit()


# Home
@app.route("/")
def home():
    return render_template('home.html')


# API Endpoint, where the data gets sent to and the point gets put into the DB
# Calling out to the api looks like this: http://127.0.0.1:5000/send?classign=DUSKY17&lat=30.63&long=-96.48&heading=142.34
@app.route("/send")
def send():
    callsign = request.args.get("callsign", type=str)
    lat = request.args.get("lat", type=float)
    long = request.args.get("long", type=float)
    heading = request.args.get("heading", type=float)

    if callsign is not None and lat is not None and long is not None and heading is not None:
        # Inserting into DB, it's own connection
        with sqlite3.connect('database.db') as con:
            cur = con.cursor()
            cur.execute("INSERT INTO points(callsign, lat, long, heading) VALUES (?, ?, ?, ?)", 
                        (callsign, lat, long, heading))
            con.commit()

        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Error with lat, long, or heading number(s) in URL"})
    

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
    global testJSON17, testJSON21

    # Send both our test JSON files to the jsonEnd end point
    url = "http://127.0.0.1:5000/jsonEnd"
    for file in [testJSON17, testJSON21]:
        with open(file, "rb") as f:
            # This send our full file, key is file and value is an object
            files = {"file": f}
            requests.post(url, files=files)

    # Read the data from the file, store it, modify defined values, then re-store them
    for file in [testJSON17, testJSON21]:
        with open(file, "r") as f:
            data = json.load(f)

        # Update the values for the next go around
        data["position"]["latitude"] = round((data["position"]["latitude"] + 0.0005), 4)
        data["position"]["longitude"] = round((data["position"]["longitude"] + 0.0005), 4)
        data["orientation"]["yaw"] = round((data["orientation"]["yaw"] + 5), 2)

        # Delete the old values and replace with our incremeneted ones
        with open(file, "w") as f:
            json.dump(data, f, indent=4)

    return jsonify({"status": "success"})


# This resets our Script2 JSON file initial values back to normal
@app.route("/script2/reset", methods=['POST'])
def script2Reset():
    global testJSON17, testJSON21
    global initLat17, initLong17, initHeading17
    global initLat21, initLong21, initHeading21

    # Read in the file contents, save them as an object
    for file in [testJSON17, testJSON21]:
        with open(file, "r") as f:
            data = json.load(f)

        # Reset these values back to pre-defined defaults
        if data["call_sign"] == "DUSKY21":
            data["position"]["latitude"] = initLat21
            data["position"]["longitude"] = initLong21
            data["orientation"]["yaw"] = initHeading21
        elif data["call_sign"] == "DUSKY17":
            data["position"]["latitude"] = initLat17
            data["position"]["longitude"] = initLong17
            data["orientation"]["yaw"] = initHeading17
        
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
    url = f"http://127.0.0.1:5000/send?callsign={callsign}&lat={lat}&long={long}&heading={heading}"
    requests.get(url)

    return jsonify({"status": "success"})


# Run the App
if __name__ == '__main__':
    app.run(debug=True)




''' OLD SCRIPT
# Script 1 initial values
s1lat = 30.63
s1long = -96.48
s1heading = 0

# This route is called when we click the S1 button once
@app.route("/script1", methods=['POST'])
def script1():
    global s1lat, s1long, s1heading

    # Send the plane info to our Flask "/send" function above in this file, it'll be sent once a second based on JS
    url = f"http://127.0.0.1:5000/send?lat={s1lat}&long={s1long}&heading={s1heading}"
    requests.get(url)

    s1lat += 0.005
    s1long += 0.005
    s1heading += 10

    return jsonify({"status": "success"})
    # return jsonify({"status": "step", "lat": lat, "long": long, "heading": heading})


# This resets our Script1 initial values back to normal
@app.route("/script1/reset", methods=['POST'])
def script1Reset():
    global s1lat, s1long, s1heading
    s1lat = 30.63
    s1long = -96.48
    s1heading = 0

    return jsonify({"status": "success"})
'''