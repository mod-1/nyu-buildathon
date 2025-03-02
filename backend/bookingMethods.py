import requests
import dotenv
import os

dotenv.load_dotenv()

api_key = os.getenv("BOOKING_API_KEY")
headers = {
		"x-rapidapi-key": api_key,
		"x-rapidapi-host": "booking-com15.p.rapidapi.com"
}

def getDestination(dest:dict):
	url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination"
	querystring = {"query":dest}
	response = requests.get(url, headers=headers, params=querystring)
	return response.json()["data"][0]["dest_id"]


def getHotels(dest_id:str,arrival_date:str,departure_date:str):
	url = "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"

	querystring = {"dest_id":dest_id,
				"search_type":"CITY",
				"arrival_date":arrival_date,
				"departure_date":departure_date,
				"adults":"1",
				"room_qty":"1",
				"page_number":"1",
				"units":"metric",
				"sort_by":"price",
				"languagecode":"en-us","currency_code":"USD"}

	response = requests.get(url, headers=headers, params=querystring)
	# print(response.json())
	return response.json()

def getTaxiDestination(destStr:str):
	url = "https://booking-com15.p.rapidapi.com/api/v1/taxi/searchLocation"
	queryString = { "query":destStr }
	response = requests.get(url, headers=headers, params=queryString)
	return response.json()

def getTaxiInfo(src_id:str,dest_id:str,pick_up_date:str,pick_up_time:str):
	url = "https://booking-com15.p.rapidapi.com/api/v1/taxi/searchTaxi"
	queryString = {
		"pick_up_place_id":src_id,
		"drop_off_place_id":dest_id,
		"pick_up_date":pick_up_date,
		"pick_up_time":pick_up_time,
		"currency_code":"USD"
	}	
	print(queryString)
	response = requests.get(url, headers=headers, params=queryString)
	# print(response.json())
	return response.json()