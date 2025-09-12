# This is for someone wanting to send a JSON file to our site
import requests

# URL to send JSON to
url = "http://127.0.0.1:5000/jsonEnd"

# Path to your json file (this is where you could put some loop or conditional)
jsonFilePath = "../jsonTest/test.json"

# Opening the file, make it a multipart form, send it to the url
with open(jsonFilePath, "rb") as f:
    files = {"file": f}
    response = requests.post(url, files=files)

# Print the response, error handling
print("Status Code: ", response.status_code)
print("Response JSON: ", response.json())