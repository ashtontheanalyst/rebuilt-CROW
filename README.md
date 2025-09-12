# Rebuilding the CROW ARI Drone Application
Originally, my team built a web application that could track autonomous drone data via sending
JSON files from Corpus Christi to College Station. Now, we are redoing the app with a more
sleek UI, better back end data processing and storing, and more efficient screen rendering/tools.
<br><br>

<video src="demos/demo12SEP2025.mp4" width="800" height="400" controls></video>

## Notes:
- As of 12SEP25, I have a full working app with in house scripting/demo capability. There is a main map,
two bottom row displays (one being telemetry data and the other a mini-map), you can flip map styles
by clicking the mini-map, there's a script button that demos two planes JSON files being sent and processed,
and more.

## Running the App Locally:
- Activate virtual env. in correct directory/terminal
- Make sure all code is up to date and saved locally
- Run:
```sh
py app.py
```
- See it here: [WEBSITE](http://127.0.0.1:5000)
<br><br>


## Creating the Virtual Environment:
```sh
py -m venv myenv
```

### Getting Around Firewall in Termainal:
```sh
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Start Env:
- Windows:
    ```sh
    myenv\Scripts\activate
    ```
- Linux:
    ```sh
    source myenv/bin/activate
    ```

### Downloading Requirements.txt
NOTE: Make sure the virtual environment is active before doing this or it
will install eveything locally instead.
```sh
py -m pip install -r requirements.txt
```

### Selecting Interpreter
NOTE: In VSCode, you have to specify your python environment so that it can see your
dependencies like Flask, MatPlotLib, and etc.
```sh
Crtl + Shift + p
'Python: Select Interpreter'
'Python x.x.x (envName) ...'
```

### Stop Env:
- Windows:
    ```sh
    myenv\Scripts\deactivate.bat
    ```
- Linux:
    ```sh
    deactivate
    ```