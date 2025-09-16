// CONST: Initialize the map itself with init positions, object, name, type, and tile holders
let mapLat;
let mapLong;
var map;
let mapName;
let mapType = 1;
const mapBtn = document.getElementById("ctrlBtn1");
let map1;
let map2;

// CONST: For the mini map
// mapMini is the object, mini1 and 2 hold the tiles
// maptype is always opposite of the main map so you get both styles on screen
var mapMini;
let mapMini1;
let mapMini2;

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

// CONST: Plane and Marker Icons
let mapPath = "#ffd700"
var goldPlaneIcon = L.icon({
    iconUrl: './static/assets/goldPlaneIcon.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});
var goldPlaneIconMini = L.icon({
    iconUrl: './static/assets/goldPlaneIcon.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});
var goldMarker = L.icon({
    iconUrl: './static/assets/goldMarker.svg',
    iconSize: [1, 1],
    iconAnchor: [0.5, 0.5]
});

// CONST: BCDC Icons
let bcdc;
let bcdcMini;
var bcdcIcon = L.icon({
    iconUrl: './static/assets/bcdcIcon.svg',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
});
var bcdcIconMini = L.icon({
    iconUrl: './static/assets/bcdcIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5]
});

// CONST: Scripts
const optnsBox = document.getElementById("optnsBox");
let script1Toggle = 1;  // 1 denotes not running, 2 means running, 3 is paused
let script1Label;       // This is what shows in the terminal div element
const script1Btn = document.getElementById("ctrlBtn1");

let script2Toggle = 1;
let script2Label;
const script2Btn = document.getElementById("ctrlBtn2");


// CONST: Bottom Telem Box
let trackedCallsign;
const telemBox = document.getElementById("telemBox");
const telemTitle = document.getElementById("telemTitle");


// First build of the map
function initMap() {
    // This is THE map object, super important
    mapLat = 30.6328;
    mapLong = -96.3705;
    map = L.map('map', {zoomControl: false}).setView([mapLat, mapLong], 12).on("click", () => {
        trackedCallsign = null;
        clearTelemBox();
    });
    mapName = document.createElement("p");

    // Adding a tile layer, we have different options right now based on the mapType value
    if (mapType == 1) {
        map1 = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            opacity: 0.75
        }).addTo(map);

        mapName.textContent = "Map Type: Style 1"
        optnsBox.appendChild(mapName);
    } 
    else if (mapType == 2) {
        map2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20
		}).addTo(map);

        mapName.textContent = "Map Type: Style 2"
        optnsBox.appendChild(mapName);
    }

    // BCDC Icon
    bcdc = L.marker([30.6376, -96.4891], {icon: bcdcIcon}).addTo(map)
            .bindPopup("BCDC");
}


// This initializes the mini map, it's the reverse layer of the big map (alt view) and zoomed in
function initMapMini() {
    // We limit the user control of this map so that users mainly interact with the main map
    mapMini = L.map('mapMini', {
        zoomControl: false,
        doubleClickZoom: false,
        dragging: false,
        scrollWheelZoom: false
    }).setView([mapLat, mapLong], 9);

    if (mapType == 1) {
        mapMini2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20
		}).addTo(mapMini);
    } 
    else if (mapType == 2) {
        mapMini1 = googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            opacity: 0.75
        }).addTo(mapMini);
    }

    bcdcMini = L.marker([30.6376, -96.4891], {icon: bcdcIconMini}).addTo(mapMini)
            .bindPopup("BCDC");
}


// This function remakes the map scheme based on 'MAP' button press, basically a toggle button
function changeMap() {
    if (mapType == 1) {
        // For the big map
        map.removeLayer(map1);
        
        mapName.textContent = "Map Type: Style 2";
        
        map2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20
		}).addTo(map);

        // For the mini map
        if (mapMini1) mapMini.removeLayer(mapMini1);
        if (mapMini2) mapMini.removeLayer(mapMini2);

        mapMini1 = googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            opacity: 0.75
        }).addTo(mapMini);

        mapType = 2;
    } 
    else if (mapType == 2) {
        map.removeLayer(map2);
        
        mapName.textContent = "Map Type: Style 1"

        map1 = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            opacity: 0.75
        }).addTo(map);

        // For the mini Map
        if (mapMini1) mapMini.removeLayer(mapMini1);
        if (mapMini2) mapMini.removeLayer(mapMini2);

        mapMini2 = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
			maxZoom: 20
		}).addTo(mapMini);

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
 
            // Add the plane positional markers on the screen
            const marker = L.marker([point.lat, point.long], {icon: goldMarker}).addTo(map);
            // Save the marker icons of the planes to the associated array
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

            // This all is what makes the plane icons show up on big and mini map
            const heading = point.heading;
            let plane;
            let planeMini;
            if (mapType == 1) {
                plane = L.marker([point.lat, point.long], {
                    icon: goldPlaneIcon,
                    // This is our GitHub addition for rotating the plane based on heading
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {
                    // If the plane is clicked, it'll live update the telembox with it's associated info
                    trackedCallsign = point.callsign;
                    updateTelemBox(point);
                });

                // This adds it to the mini map
                planeMini = L.marker([point.lat, point.long], {
                    icon: goldPlaneIconMini,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(mapMini);
            } 
            else if (mapType == 2) {
                plane = L.marker([point.lat, point.long], {
                    icon: goldPlaneIcon,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {
                    trackedCallsign = point.callsign;
                    updateTelemBox(point);
                });

                planeMini = L.marker([point.lat, point.long], {
                    icon: goldPlaneIconMini,
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

        // This is what keeps the telembox updating every second if it's been selected (plane's been clicked)
        if (trackedCallsign && point.callsign === trackedCallsign) {
            updateTelemBox(point);
        }
    });

    // Keep getLabelInfo up to date
    getLabelInfo(data);
}


// This is what updates the telembox. We clear it's data then replace with fresh
function updateTelemBox(point) {
    telemBox.innerHTML = "";
    telemTitle.textContent = `${point.callsign}`;

    // Create our elements and fill them
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
}

// This is mainly to reset the box to default when a user clicks the MAP and not a PLANE
function clearTelemBox() {
    telemTitle.textContent = "Select a Plane";
    telemBox.innerHTML = "";
}


// This is what will display the info when the button is toggled next to the plane (bottom right)
function toggleLabels() {
    if (markers.length > 0) {
        return;
    }
}


// Toggle labels is fired when the button is clicked, shows flight data by the plane on map
function getLabelInfo(data) {
    data.forEach((point) => {
        console.log(point);

        // Separate the data to specific planes
        switch (point.callsign) {
            case "DUSKY17":
                return;
                break;
            case "DUSKY17":
                return;
                break;
            default:
                console.log("NOTE: getLabelData() not receiving pre-determined named drone data");
        }
    });
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