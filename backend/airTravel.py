import http.client
import json

import requests
import dotenv
import os

dotenv.load_dotenv()


api_keys= os.getenv("AIR_TRAVEL_API")
headers = {
    'x-rapidapi-key': api_keys,
    #  
    # The above is the API key in case things don't work
    'x-rapidapi-host': "sky-scrapper.p.rapidapi.com"
}


def getAirportIDDetails(nameOfTheAirport):
    nameOfTheAirport= nameOfTheAirport.replace(' ','')
    conn = http.client.HTTPSConnection("sky-scrapper.p.rapidapi.com")
    
    
    url= "/api/v1/flights/searchAirport?query="+str(nameOfTheAirport)+"&locale=en-US"
    ##url= url.strip
    ##url= url.replace(' ','')
    #print(url)
    conn.request("GET", "/api/v1/flights/searchAirport?query="+str(nameOfTheAirport)+"&locale=en-US", headers=headers)
    
    res = conn.getresponse()
    data = res.read()
    json_data= json.loads(data)
    #print(data.decode("utf-8"))
    #print("ttttttttttttttttttttttttt")
    #print(json_data)
    return json_data
    
    
def getJSONdata(originSkyId="LOND",destinationSkyId="NYCA",date='2025-03-21',originEntityId="27544008",destinationEntityId="27537542",cabinClass="economy",adults=1,sortBy='best'):
    conn = http.client.HTTPSConnection("sky-scrapper.p.rapidapi.com")
    
    
    
    
    url = "/api/v2/flights/searchFlights?originSkyId=" + originSkyId +"&destinationSkyId=" + destinationSkyId + "&date=" + date +"&originEntityId=" + originEntityId + "&destinationEntityId=" + destinationEntityId + "&cabinClass=" + cabinClass + "&adults=" + str(adults) +"&sortBy=" + sortBy +"&currency=USD&market=en-US&countryCode=US"
    url=url.replace(" ","")
    conn.request("GET", url, headers=headers)

    #print("URL is " +url)

    
    res = conn.getresponse()
    data = res.read()
    json_data= json.loads(data)
    #print(data)    
    ##print(data.decode("utf-8"))
    return json_data

def getTravelDetails(originAirport="London", destinationAirport="New York", date='2025-04-25',cabinClass="economy",adults='1',sortBy="price_high"):
    dorg= getAirportIDDetails(originAirport)
    ddes= getAirportIDDetails(destinationAirport)
    relevantFlightParams_org=dorg['data']
    relevantFlightParams_des=ddes['data']
    #print(relevantFlightParams_org)
    #print(relevantFlightParams_des)
    #originSkyId,destinationSkyId,date,originEntityId,destinationEntityId,cabinClass,adults=1,sortBy='best'
    originSkyId=      relevantFlightParams_org[0]["skyId"]
    destinationSkyId= relevantFlightParams_des[0]["skyId"]
    originEntityId=   relevantFlightParams_org[0]["entityId"]
    destinationEntityId= relevantFlightParams_des[0]["entityId"]
    ##time.sleep(2)
    #print("YYYYYYYYYYYYYYYYYYYYYYY")
    #print(originSkyId,destinationSkyId,date,originEntityId,destinationEntityId,cabinClass,adults)
    #print("XXXXXXXXXXXXXXXXXXXXXXXX")
    
    z1=getJSONdata(originSkyId,destinationSkyId,date,originEntityId,destinationEntityId,cabinClass,adults)
    print(z1)

    return z1

def airTravel(originAirport="London", destinationAirport="New York", date='2025-05-25',cabinClass="economy",adults='1',sortBy="price_high",k_value=0):
    ans= getTravelDetails(originAirport,destinationAirport,date,cabinClass,adults,sortBy)
    return json.dumps(ans['data']['itineraries'][k_value])


