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

// DUSKY18
var markers18 = [];
var planePos18 = [];
var planePosMini18 = [];
var polylines18 = [];
// DUSKY21
var markers21 = [];
var planePos21 = [];
var planePosMini21 = [];
var polylines21 = [];
// DUSKY24
var markers24 = [];
var planePos24 = [];
var planePosMini24 = [];
var polylines24 = [];
// DUSKY27
var markers27 = [];
var planePos27 = [];
var planePosMini27 = [];
var polylines27 = [];

// CONST: Plane and Marker Icons
let accentColor = "hsla(57, 83%, 91%, 1.00)";
let accentColorTransp = "hsla(57, 83%, 91%, 0.85)";
let accentColor2 = "#8bb4f7";
let accenColor2Light = "#d3e2fbff"
let accentColor2Dark = "#032459";
var yellowPlaneIcon = L.icon({
    iconUrl: './static/assets/yellowPlaneIcon.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});
var yellowPlaneIconMini = L.icon({
    iconUrl: './static/assets/yellowPlaneIcon.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});
var yellowMarker = L.icon({
    iconUrl: './static/assets/yellowMarker.svg',
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

let script2Toggle = 1;
let script2Label;
const script2Btn = document.getElementById("ctrlBtn2");

// CONST: Snapshot boxes
const telem18snap = document.getElementById("telem18");
const telem21snap = document.getElementById("telem21");
const telem24snap = document.getElementById("telem24");
const telem27snap = document.getElementById("telem27");

// CONST: Graph global settings
Chart.defaults.global.defaultFontColor = "white";
Chart.defaults.scale.gridLines.color = "#777";

// CONST: Graphs
let altitudeGraph;




// First build of the map
function initMap() {
    // This is THE map object, super important
    mapLat = 30.6328;
    mapLong = -96.3705;
    map = L.map('map', {zoomControl: false}).setView([mapLat, mapLong], 12).on("click", () => {
        trackedCallsign = null;
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
            const marker = L.marker([point.lat, point.long], {icon: yellowMarker}).addTo(map);
            // Save the marker icons of the planes to the associated array
            switch (point.callsign) {
                case "DUSKY18":
                    markers18.push([point.id, marker]);
                    break;
                case "DUSKY21":
                    markers21.push([point.id, marker]);
                    break;
                case "DUSKY24":
                    markers24.push([point.id, marker]);
                    break;
                case "DUSKY27":
                    markers27.push([point.id, marker]);
                    break;
                default:
                    console.log("Not a DUSKY18, 21, 24, or 27 JSON for marker creation");
                    break;
            }
            markers.push([point.id, marker]);

            // This clears the plane's old position en lieu of the new one being made
            switch (point.callsign) {
                case "DUSKY18":
                    planePos18.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini18.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                case "DUSKY21":
                    planePos21.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini21.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                case "DUSKY24":
                    planePos24.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini24.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                case "DUSKY27":
                    planePos27.forEach((plane) => {map.removeLayer(plane);});
                    planePosMini27.forEach((plane) => {mapMini.removeLayer(plane);});
                    break;
                default:
                    console.log("Not a DUSKY18, 21, 24, or 27 JSON for clearing the old point");
                    break;
            }

            // This all is what makes the plane icons show up on big and mini map
            const heading = point.heading;
            let plane;
            let planeMini;
            if (mapType == 1) {
                plane = L.marker([point.lat, point.long], {
                    icon: yellowPlaneIcon,
                    // This is our GitHub addition for rotating the plane based on heading
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {
                    // If the plane is clicked, it'll live update the telembox with it's associated info
                    trackedCallsign = point.callsign;
                });

                // This adds it to the mini map
                planeMini = L.marker([point.lat, point.long], {
                    icon: yellowPlaneIconMini,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(mapMini);
            } 
            else if (mapType == 2) {
                plane = L.marker([point.lat, point.long], {
                    icon: yellowPlaneIcon,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(map).on("click", () => {
                    trackedCallsign = point.callsign;
                });

                planeMini = L.marker([point.lat, point.long], {
                    icon: yellowPlaneIconMini,
                    rotationAngle: heading,
                    rotationOrigin: 'center center'
                }).addTo(mapMini);
            }
            
            // Add our plane's newest position to our local storage
            switch (point.callsign) {
                case "DUSKY18":
                    planePos18.push(plane);
                    planePosMini18.push(planeMini);
                    break;
                case "DUSKY21":
                    planePos21.push(plane);
                    planePosMini21.push(planeMini);
                    break;
                case "DUSKY24":
                    planePos24.push(plane);
                    planePosMini24.push(planeMini);
                    break;
                case "DUSKY27":
                    planePos27.push(plane);
                    planePosMini27.push(planeMini);
                    break;
                default:
                    console.log("Not a DUSKY18, 21, 24, 27 JSON for point re-plotting");
                    break;
            }

            // Draws the line between the points
            switch (point.callsign) {
                case "DUSKY18":
                    // If we have at least 2 markers, draw a line between them
                    if (markers18.length > 1) {
                        // Gathering the marker objects lat/long based on "point A and B"
                        let latestMarker = markers18[markers18.length - 1][1].getLatLng();
                        let beforeMarker = markers18[markers18.length - 2][1].getLatLng();

                        // Making the line based on leaflet documentation and adding it to the line array
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: accentColor}).addTo(map);
                        polylines18.push(polyline);
                    }
                    break;
                case "DUSKY21":
                    if (markers21.length > 1) {
                        let latestMarker = markers21[markers21.length - 1][1].getLatLng();
                        let beforeMarker = markers21[markers21.length - 2][1].getLatLng();
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: accentColor}).addTo(map);
                        polylines21.push(polyline);
                    }
                    break;
                case "DUSKY24":
                    if (markers24.length > 1) {
                        let latestMarker = markers24[markers24.length - 1][1].getLatLng();
                        let beforeMarker = markers24[markers24.length - 2][1].getLatLng();
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: accentColor}).addTo(map);
                        polylines24.push(polyline);
                    }
                    break;
                case "DUSKY27":
                    if (markers27.length > 1) {
                        let latestMarker = markers27[markers27.length - 1][1].getLatLng();
                        let beforeMarker = markers27[markers27.length - 2][1].getLatLng();
                        var latlongs = [latestMarker, beforeMarker];
                        const polyline = L.polyline(latlongs, {color: accentColor}).addTo(map);
                        polylines27.push(polyline);
                    }
                    break;
                default:
                    console.log("Not a DUSKY18, 21, 24, or 27 JSON for drawing line between points");
                    break;
            }

            // This is for our snapshot telem boxes
            updateSnapBoxes(point);

            // Update the graphs HERE? -------------------------------------------------------------------------------######
        }

        // Basically, increment up from the last ID
        lastPoint = Math.max(lastPoint, point.id);
    });
}




// Updates the bottom telem snapshot boxes with current flight data
function updateSnapBoxes(point) {
    switch (point.callsign) {
        case "DUSKY18":
            // Clear the html from the box first (apart from the callsign title)
            telem18snap.innerHTML = "";

            // Update with new data in the proper format
            telem18snap.innerHTML = `
                <b>LAT</b> ${Number(point.lat).toFixed(4)}<br>
                <b>LON</b> ${Number(point.long).toFixed(4)}<br>
                <b>DIR</b> ${Number(point.heading)}`
            break;
        case "DUSKY21":
            telem21snap.innerHTML = "";
            telem21snap.innerHTML = `
                <b>LAT</b> ${Number(point.lat).toFixed(4)}<br>
                <b>LON</b> ${Number(point.long).toFixed(4)}<br>
                <b>DIR</b> ${Number(point.heading)}`
            break;
        case "DUSKY24":
            telem24snap.innerHTML = "";
            telem24snap.innerHTML = `
                <b>LAT</b> ${Number(point.lat).toFixed(4)}<br>
                <b>LON</b> ${Number(point.long).toFixed(4)}<br>
                <b>DIR</b> ${Number(point.heading)}`
            break;
        case "DUSKY27":
            telem27snap.innerHTML = "";
            telem27snap.innerHTML = `
                <b>LAT</b> ${Number(point.lat).toFixed(4)}<br>
                <b>LON</b> ${Number(point.long).toFixed(4)}<br>
                <b>DIR</b> ${Number(point.heading)}`
            break;
    }
}

function clearSnapBoxes() {
    telem18snap.innerHTML = "NA";
    telem21snap.innerHTML = "NA";
    telem24snap.innerHTML = "NA";
    telem27snap.innerHTML = "NA";
}




// Clear the map and lines, then the DB
async function clearMap() {
    // Remove the locally stored markers, plane icon, and lines from our map
    markers.forEach(([id, marker]) => {map.removeLayer(marker);});

    planePos18.forEach((plane) => {map.removeLayer(plane);});
    planePosMini18.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines18.forEach((polyline) => {map.removeLayer(polyline);});

    planePos21.forEach((plane) => {map.removeLayer(plane);});
    planePosMini21.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines21.forEach((polyline) => {map.removeLayer(polyline);});

    planePos24.forEach((plane) => {map.removeLayer(plane);});
    planePosMini24.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines24.forEach((polyline) => {map.removeLayer(polyline);});

    planePos27.forEach((plane) => {map.removeLayer(plane);});
    planePosMini27.forEach((plane) => {mapMini.removeLayer(plane);});
    polylines27.forEach((polyline) => {map.removeLayer(polyline);});

    // Clear the markers and polylines and set the primary key to 0 again
    markers = [];
    markers18 = [];
    markers21 = [];
    markers24 = [];
    markers27 = [];
    polylines18 = [];
    polylines21 = [];
    polylines24 = [];
    polylines27 = [];
    lastID = 0;

    // Clear the contents of our snap boxes, revert to default
    clearSnapBoxes();

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

        // Change the button color to maroon
        script2Btn.style.backgroundColor = "#500000";
        script2Btn.style.color = "white";
        
        // Start the script, run it every second to the Flask side until we click the button again
        script2Interval = setInterval(async () => {
            await fetch("/script2", {method: "POST"});
        }, 1000);
    } 
    else if (script2Toggle == 2) {
        // Paused state, we can view the plane's points, path, etc.
        script2Toggle = 3;
        script2LabelMake(3);

        // Yellow for paused
        script2Btn.style.backgroundColor = "#323335";
        script2Btn.style.color = "white";

        clearInterval(script2Interval);
        script2Interval = null;
    }
    else if (script2Toggle == 3) {
        // If the script is paused and we click again, reset everything, set back to 1 which is 'not running'
        script2Toggle = 1;
        clearInterval(script2Interval);
        script2Interval = null;

        script2Btn.style.backgroundColor = "white";
        script2Btn.style.color = "black";

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




async function startGraphs() {
    // Grab all of the flight data, then we're just going to look at the last 4 values
    // in the array which are DUSKY 18, etc.'s most recent information
    const response = await fetch(`/list`, { cache: "no-store" });
    const data = await response.json();
    const recent = data.slice(-4)
    
    // This is for the altitude graph, we start with an empty array every second, fill it with the 4
    // altitude values (1 from each of the 4 flights), then send that info to update the graph
    let altitudes = [];
    recent.forEach((point) => {
        altitudes.push(point.alt);
    });
    updateAltGraph(altitudes);
}




// Makes the graph, initialization
let graph1 = document.getElementById("graph1").getContext('2d');
function makeAltGraph() {
    // This is the object that is a graph, we then go in and assign, then define values
    altitudeGraph = new Chart(graph1, {
        type: 'bar',    // Diff types include bar, horizontalBar, pie, line, radar, etc.
        data: {
            labels: ['DUSKY18', 'DUSKY21', 'DUSKY24', 'DUSKY27'],   // X-axis values
            datasets: [{
                label: 'Altitude',
                data: [0, 0, 0, 0],                                    // Y-axis values
                backgroundColor: accentColor2,
                borderWidth: 4,                                     // Sets a border width by pixel count
                hoverBackgroundColor: accenColor2Light
            }],
        },
        options: {
            title: {
                display: true,
                text: 'Altitude by Aircraft',
                fontSize: 24
            },
            legend: {
                position: 'bottom'                                  // Change the positioning of the y-axis label legend
            },
        }
    });
}


// Changes the graph elements as they come in instead of REMAKING the whole graph
function updateAltGraph(altitudes) {
    // Make the graph if we don't already have it, initialization
    if (!altitudeGraph) {
        makeAltGraph();
    }

    altitudeGraph.data.datasets[0].data = altitudes;
    altitudeGraph.update();
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
setInterval(startGraphs, 1000);