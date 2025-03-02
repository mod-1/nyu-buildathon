import json
import requests
import dotenv
import os

dotenv.load_dotenv()

api_key = os.getenv("AIR_TRAVEL_API")
headers = {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': "sky-scrapper.p.rapidapi.com"
}

def getAirportIDDetails(nameOfTheAirport):
    url = "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport"
    params = {
        "query": nameOfTheAirport,
        "locale": "en-US"
    }
    
    response = requests.get(url, headers=headers, params=params)
    json_data = response.json()
    
    return json_data

def getJSONdata(originSkyId="LOND", destinationSkyId="NYCA", date='2025-03-21', originEntityId="27544008", destinationEntityId="27537542", cabinClass="economy", adults=1, sortBy='best'):
    url = "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights"
    params = {
        "originSkyId": originSkyId,
        "destinationSkyId": destinationSkyId,
        "date": date,
        "originEntityId": originEntityId,
        "destinationEntityId": destinationEntityId,
        "cabinClass": cabinClass,
        "adults": str(adults),
        "sortBy": sortBy,
        "currency": "USD",
        "market": "en-US",
        "countryCode": "US"
    }
    
    response = requests.get(url, headers=headers, params=params)
    json_data = response.json()
    
    return json_data

def getTravelDetails(originAirport="London", destinationAirport="New York", date='2025-04-25', cabinClass="economy", adults='1', sortBy="price_high"):
    dorg = getAirportIDDetails(originAirport)
    ddes = getAirportIDDetails(destinationAirport.split(',')[0])
    relevantFlightParams_org = dorg['data']
    relevantFlightParams_des = ddes['data']
    originSkyId = relevantFlightParams_org[0]["skyId"]
    destinationSkyId = relevantFlightParams_des[0]["skyId"]
    originEntityId = relevantFlightParams_org[0]["entityId"]
    destinationEntityId = relevantFlightParams_des[0]["entityId"]
    
    z1 = getJSONdata(originSkyId, destinationSkyId, date, originEntityId, destinationEntityId, cabinClass, adults)
    
    return z1

def airTravel(originAirport="London", destinationAirport="New York", date='2025-05-25', cabinClass="economy", adults='1', sortBy="price_high", k_value=0):
    ans = getTravelDetails(originAirport, destinationAirport, date, cabinClass, adults, sortBy)
    return ans['data']['itineraries'][k_value]