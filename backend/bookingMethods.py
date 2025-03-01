import requests
import dotenv
import os

dotenv.load_dotenv()

api_key = os.getenv("BOOKING_API_KEY")

def getDestination(queryStr:str):
url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination"

querystring = {"query":"Gulmarg"}

headers = {
	"x-rapidapi-key": "b8c58f9d67msh909dd3e43316b91p1378dcjsn7265606eed9b",
	"x-rapidapi-host": "booking-com15.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())


url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"

querystring = {"dest_id":"-2092174","search_type":"CITY","adults":"1","children_age":"0,17","room_qty":"1","page_number":"1","units":"metric","temperature_unit":"c","languagecode":"en-us","currency_code":"AED"}

headers = {
	"x-rapidapi-key": api_key,
	"x-rapidapi-host": "booking-com15.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())