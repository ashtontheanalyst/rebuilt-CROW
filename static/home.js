// CONST: Initialize the map itself
let mapLat;         // These are the initial map center positions
let mapLong;
var map;
let mapName;
let mapType = 2;
const mapBtn = document.getElementById("ctrlBtn1");
let map1;
let map2;
let selectedPlaneID;

// CONST: For the mini map, similar to big map
var mapMini;
// It's map type is always the opposite of the regular map, so def is 1
let mapMini1;
let mapMini2;
let bcdcMini;

// CONST: Markers, Plane position, Icons, lines, etc. These are things ON the map
var markers = [];
let lastPoint = 0;
// DUSK21
var markers21 = [];
var planePos21 = [];
var planePosMini21 = [];
var polylines21 = [];
// DUSKY17
var markers17 = [];
var planePos17 = [];
var planePosMini17 = [];
var polylines17 = [];

// CONST: Icons
var mapPoint = L.icon({
    iconUrl: './static/assets/redPointIcon.svg',
    iconSize: [5, 5],
    iconAnchor: [2.5, 2.5]
});
var blackPlaneIcon = L.icon({
    iconUrl: './static/assets/blackPlane.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});
var whitePlaneIcon = L.icon({
    iconUrl: './static/assets/whitePlane.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});
var blackPlaneIconMini = L.icon({
    iconUrl: './static/assets/blackPlane.svg',
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5]
});
var whitePlaneIconMini = L.icon({
    iconUrl: './static/assets/whitePlane.svg',
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5]
});
let bcdc;
var blackBCDCIcon = L.icon({
    iconUrl: './static/assets/blackBcdcIcon.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
});
var whiteBCDCIcon = L.icon({
    iconUrl: './static/assets/whiteBcdcIcon.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
});
var blackBCDCIconMini = L.icon({
    iconUrl: './static/assets/blackBcdcIcon.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});
var whiteBCDCIconMini = L.icon({
    iconUrl: './static/assets/whiteBcdcIcon.svg',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});
let mapPath = "#ee323eff"

// CONST: Scripts
const optnsBox = document.getElementById("optnsBox");
let script1Toggle = 1;  // 1 denotes not running, 2 means running, 3 is paused
let script1Label;       // This is what shows in the terminal div element
const script1Btn = document.getElementById("ctrlBtn1");

let script2Toggle = 1;
let script2Label;
const script2Btn = document.getElementById("ctrlBtn2");


// CONST: Bottom Telem Box
let telemClicked = false;
const telemBox = document.getElementById("telemBox");
const telemTitle = document.getElementById("telemTitle");


// First build of the map
function initMap() {
    // This is THE map object, super important
    mapLat = 30.6328;
    mapLong = -96.3705;
    map = L.map('map').setView([mapLat, mapLong], 12);
    mapName = document.createElement("p");

    // Adding a tile layer, we have different options right now based on the mapType value
    if (mapType == 1) {
        map1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Add BCDC icon
        bcdc = L.marker([30.6376, -96.4891], {icon: blackBCDCIcon}).addTo(map)
            .bindPopup("BCDC");

        mapName.textContent = "Map Type: Style 1"
        optnsBox.appendChild(mapName);
    } else if (mapType == 2) {
        map2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		}).addTo(map);

        bcdc = L.marker([30.6376, -96.4891], {icon: whiteBCDCIcon}).addTo(map)
            .bindPopup("BCDC");

        mapName.textContent = "Map Type: Style 2"
        optnsBox.appendChild(mapName);
    }
}


// This initializes the mini map, it's the reverse layer of the big map (alt view) and zoomed in
function initMapMini() {
    // We limit the user control of this map so that users mainly interact with the main map
    mapMini = L.map('mapMini', {
        zoomControl: false,
        doubleClickZoom: false,
        dragging: false,
        scrollWheelZoom: false
    }).setView([mapLat, mapLong], 10);

    if (mapType == 1) {
        mapMini2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		}).addTo(mapMini);

        bcdcMini = L.marker([30.6376, -96.4891], {icon: whiteBCDCIconMini}).addTo(mapMini)
            .bindPopup("BCDC");
    } else if (mapType == 2) {
        mapMini1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapMini);

        bcdcMini = L.marker([30.6376, -96.4891], {icon: blackBCDCIconMini}).addTo(mapMini)
            .bindPopup("BCDC");
    }
}


// This function remakes the map scheme based on 'MAP' button press, basically a toggle button
function changeMap() {
    if (mapType == 1) {
        // For the big map
        map.removeLayer(map1);
        map.removeLayer(bcdc);
        
        mapName.textContent = "Map Type: Style 2";
        
        map2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		}).addTo(map);
        bcdc = L.marker([30.6376, -96.4891], {icon: whiteBCDCIcon}).addTo(map)
            .bindPopup("BCDC");

        // For the mini map
        if (mapMini1) mapMini.removeLayer(mapMini1);
        if (mapMini2) mapMini.removeLayer(mapMini2);
        if (bcdcMini) mapMini.removeLayer(bcdcMini);

        mapMini1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapMini);
        bcdcMini = L.marker([30.6376, -96.4891], {icon: blackBCDCIconMini}).addTo(mapMini)
            .bindPopup("BCDC");

        mapType = 2;
    } else if (mapType == 2) {
        map.removeLayer(map2);
        map.removeLayer(bcdc);
        
        mapName.textContent = "Map Type: Style 1"

        map1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        bcdc = L.marker([30.6376, -96.4891], {icon: blackBCDCIcon}).addTo(map)
            .bindPopup("BCDC");

        // For the mini Map
        if (mapMini1) mapMini.removeLayer(mapMini1);
        if (mapMini2) mapMini.removeLayer(mapMini2);
        if (bcdcMini) mapMini.removeLayer(bcdcMini);

        mapMini2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20,
			attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
		}).addTo(mapMini);
        bcdcMini = L.marker([30.6376, -96.4891], {icon: whiteBCDCIconMini}).addTo(mapMini)
            .bindPopup("BCDC");

        mapType = 1;
    }

    // Fix rendering glitch in the mini map
    mapMini.invalidateSize();
}


// Updating the map as data comes in, this is for our markers, icons, lines, etc.
async function updateMap() {
    // NOTE: cache: "no-store" may free up some memory?
    const response = await fetch(`/list?last=${lastPoint}`, { cache: "no-store" });
    const data = await response.json();

    data.forEach((point) => {
        // Only add a point if we don't already have it on the map/in the marker array at large
        if (!markers.some(([id]) => id === point.id)) {
 
            // Add the marker on the map and add to the array with it's identifier
            const marker = L.marker([point.lat, point.long], {icon: mapPoint}).addTo(map);
            switch (point.callsign) {
                case "DUSKY21":
                    markers21.push([point.id, marker]);
                    break;
                case "DUSKY17":
                    markers17.push([point.id, marker]);
                    break;
                default:
                    console.log("Not a DUSKY21 or 17 JSON for marker creation");
                    break;
            }
            markers.push([point.id, marker]);

            // This clears the plane's old position en lieu of the new one being made
            switch (point.callsign) {
                case "DUSKY21":
                    planePos21.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini21.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                case "DUSKY17":
                    planePos17.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini17.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                default:
                    console.log("Not a DUSKY21 or 17 JSON for clearing the old point");
                    break;
            }

            // This is making the plane show up, the color of the plane changes based on the background map style
            const heading = point.heading;
            let plane;
            let planeMini;
            if (mapType == 1) {
                plane = L.marker([point.lat, point.long], {
                    icon: blackPlaneIcon,
                    // This is our GitHub addition for rotating the plane based on heading
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {telemClicked = true});

                // This adds it to the mini map
                planeMini = L.marker([point.lat, point.long], {
                    icon: whitePlaneIconMini,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(mapMini);
            } else if (mapType == 2) {
                plane = L.marker([point.lat, point.long], {
                    icon: whitePlaneIcon,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {telemClicked = true});

                planeMini = L.marker([point.lat, point.long], {
                    icon: blackPlaneIconMini,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(mapMini);
            }
            
            // Add our plane's newest position to our local storage
            switch (point.callsign) {
                case "DUSKY21":
                    planePos21.push(plane);
                    planePosMini21.push(planeMini);
                    break;
                case "DUSKY17":
                    planePos17.push(plane);
                    planePosMini17.push(planeMini);
                    break;
                default:
                    console.log("Not a DUSKY21 or 17 JSON for point re-plotting");
                    break;
            }

            // Draws the line between the points
            switch (point.callsign) {
                case "DUSKY21":
                    // If we have at least 2 markers, draw a line between them
                    if (markers21.length > 1) {
                        
                        // Gathering the marker objects lat/long based on "point A and B"
                        let latestMarker = markers21[markers21.length - 1][1].getLatLng();
                        let beforeMarker = markers21[markers21.length - 2][1].getLatLng();

                        // Making the line based on leaflet documentation and adding it to the line array
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: mapPath}).addTo(map);
                        polylines21.push(polyline);
                    }
                    break;
                case "DUSKY17":
                    if (markers17.length > 1) {
                        let latestMarker = markers17[markers17.length - 1][1].getLatLng();
                        let beforeMarker = markers17[markers17.length - 2][1].getLatLng();
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: mapPath}).addTo(map);
                        polylines17.push(polyline);
                    }
                    break;
                default:
                    console.log("Not a DUSKY21 or 17 JSON for drawing line between points");
                    break;
            }
        }

        // Basically, increment up from the last ID
        lastPoint = Math.max(lastPoint, point.id);

        // Update the telembox with better data if we have a click on a plane
        if (telemClicked == true) {
            updateTelemBox(point);
        }
    });
}


// When a plane is clicked, we keep updating the telemetry box in the bottom row as it comes in
function updateTelemBox(point) {
    // delete old data so we can replace it
    telemBox.innerHTML = "";

    // Replace the heading with the plane's ID
    telemTitle.textContent = `Callsign: ${point.callsign}`;

    // Create our data based on input thrown to this function (most recent point)
    let telemLat = document.createElement("p");
    telemLat.id = "telemLat";
    telemLat.textContent = `LAT: ${Number(point.lat).toFixed(4)}`;

    let telemLong = document.createElement("p");
    telemLong.id = "telemLong";
    telemLong.textContent = `LON: ${Number(point.long).toFixed(4)}`;

    let telemHeading = document.createElement("p");
    telemHeading.id = "telemHeading";
    telemHeading.textContent = `DIR: ${Number(point.heading)}`;

    telemBox.append(telemLat, telemLong, telemHeading);

    selectedPlaneID = point.id;
}


// Clear the map and lines, then the DB
async function clearMap() {
    // Remove the locally stored markers, plane icon, and lines from our map
    markers.forEach(([id, marker]) => {map.removeLayer(marker);});
    planePos21.forEach((plane) => {map.removeLayer(plane);});
    planePosMini21.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines21.forEach((polyline) => {map.removeLayer(polyline);});
    planePos17.forEach((plane) => {map.removeLayer(plane);});
    planePosMini17.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines17.forEach((polyline) => {map.removeLayer(polyline);});

    // Clear the markers and polylines and set the primary key to 0 again
    markers = [];
    markers17 = [];
    markers21 = [];
    polylines21 = [];
    polylines17 = [];
    lastID = 0;

    // Clear telem labels if they're there and reset title
    ["telemLat", "telemLong", "telemHeading"].forEach((value) => {
        if (document.getElementById(value)) {
            document.getElementById(value).remove();
        }
    });
    document.getElementById("telemTitle").textContent = "Select a Plane";
    telemClicked = false;

    // Call out to Flask to clear the DB from that end
    await clearDB();
}


// Clear the DB, this calls out to a clearDB function in the Flask Python
async function clearDB() {
    await fetch("/clearDB", {method: "POST"});
    console.log("DB Cleared");
}


// Similar to script1 but this time we upload json files
let script2Interval = null;

async function script2() {
// If the toggle button is on 1, 'not running', set it to 2, 'running'
    if (script2Toggle == 1) {
        script2Toggle = 2;

        script2LabelMake(2);
        
        // Start the script, run it every second to the Flask side until we click the button again
        script2Interval = setInterval(async () => {
            await fetch("/script2", {method: "POST"});
        }, 1000);
    } else if (script2Toggle == 2) {
        // Paused state, we can view the plane's points, path, etc.
        script2Toggle = 3;

        script2LabelMake(3);

        clearInterval(script2Interval);
        script2Interval = null;
    }
    else if (script2Toggle == 3) {
        // If the script is paused and we click again, reset everything, set back to 1 which is 'not running'
        script2Toggle = 1;
        clearInterval(script2Interval);
        script2Interval = null;

        // For this case, it just removes the label
        script2LabelMake(1);

        await clearMap();
        fetch("/script2/reset", {method: "POST"});
    }
}

// This creates the label that will be put in the monitor box in top right
function script2LabelMake(state) {
    // delete the old label
    if (script2Label) {
        script2Label.remove();
    }

    // Remake it, or for case 3 do nothing since we want it to stay nothing
    script2Label = document.createElement("p");
    script2Label.id = "script2Label";
    switch (state) {
        case 2:
            script2Label.textContent = "Script 2: Running";
            optnsBox.appendChild(script2Label);
            break;
        case 3:
            script2Label.textContent = "Script 2: Paused";
            optnsBox.appendChild(script2Label);
            break;
        case 1:
            break;
    }
}


// SITE LOGIC
// Initial load, then refresh every 1/4 second
initMap();
initMapMini();

// This keeps the mini map center coords matched with the main map
map.on("move", () => {
    const center = map.getCenter();
    mapMini.setView(center);
});

updateMap();
setInterval(updateMap, 250);




/* OLD SCRIPT
// This runs a script for one plane on the screen based on clicking the button on/off
let script1Interval = null;         // This will help the script STOP when we re-click

function script1() {
    // If the toggle button is on 1, 'not running', set it to 2, 'running'
    if (script1Toggle == 1) {
        script1Toggle = 2;

        script1LabelMake(2);
        
        // Start the script, run it every second to the Flask side until we click the button again
        script1Interval = setInterval(async () => {
            await fetch("/script1", {method: "POST"});
        }, 1000);
    } else if (script1Toggle == 2) {
        // Paused state, we can view the plane's points, path, etc.
        script1Toggle = 3;

        script1LabelMake(3);

        clearInterval(script1Interval);
        script1Interval = null;
    }
    else if (script1Toggle == 3) {
        // If the script is paused and we click again, reset everything, set back to 1 which is 'not running'
        script1Toggle = 1;
        clearInterval(script1Interval);
        script1Interval = null;

        // For this case, it just removes the label
        script1LabelMake(1);

        clearMap();
        fetch("/script1/reset", {method: "POST"});
    }
}

// This creates the label that will be put in the monitor box in top right
function script1LabelMake(state) {
    // delete the old label
    if (script1Label) {
        script1Label.remove();
    }

    // Remake it, or for case 3 do nothing since we want it to stay nothing
    script1Label = document.createElement("p");
    script1Label.id = "script1Label";
    switch (state) {
        case 2:
            script1Label.textContent = "Script 1: Running";
            optnsBox.appendChild(script1Label);
            break;
        case 3:
            script1Label.textContent = "Script 1: Paused";
            optnsBox.appendChild(script1Label);
            break;
        case 1:
            break;
    }
} 
*/