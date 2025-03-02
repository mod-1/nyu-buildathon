from flask import Flask,request as req
from datetime import datetime,timedelta
from claudeMethods import getItineryJson,getActivitiesJson
from bookingMethods import getDestination,getHotels,getTaxiDestination,getTaxiInfo
from airTravel import airTravel, getTravelDetails,getJSONdata,getAirportIDDetails
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/claude/getCountryImage')
def getCountryImage():
    params = req.args.to_dict()
    print(params)
    return params["country"]

@app.route('/claude/generateItinerary', methods=['POST'])
def getItinerary():
    '''
    params:
    country: str -> Denotes country
    days: str -> Denotes number of days
    travellingWith: str -> Denotes who the user is travelling with
    placeType: str -> Denotes type of place
    '''
    params = req.get_json()
    destStr = params["destination"]
    srcStr = params["source"]
    activities = "\n".join(params["activities"])
    days = params["days"]

    destQuery = {"query":destStr}

    arrival_date = "2025-03-10"
    departure_date = "2025-03-15"

    flightInfo=airTravel(originAirport=srcStr, destinationAirport=destStr, date=arrival_date)
    print(flightInfo.keys())
    print(f"Flight Info: {flightInfo}")
    airportLoc=f"{flightInfo['legs'][0]['origin']} Airport"
    departureTime = datetime.strptime(flightInfo["legs"][0]["departure"], "%Y-%m-%dT%H:%M:%S")
    arrivalTime=datetime.strptime(flightInfo["legs"][-1]["arrival"], "%Y-%m-%dT%H:%M:%S")
    durationInMin=0
    for leg in flightInfo["legs"]:
        durationInMin+=leg["durationInMinutes"]

    print(departureTime)

    dest_id=getDestination(destQuery)
    hotel=getHotels(dest_id=dest_id,arrival_date=arrival_date,departure_date=departure_date)["data"]["hotels"][0]
    hotelName=hotel["property"]["name"]
    hotelPrice=hotel["property"]["priceBreakdown"]["grossPrice"]["value"]
    print(f"Hotel selected: {hotel}")


    dest_id = getTaxiDestination(airportLoc)["data"][0]["googlePlaceId"]
    src_id = getTaxiDestination(srcStr)["data"][0]["googlePlaceId"]



    pick_up_date = arrival_date
    pick_up_time = (departureTime - timedelta(hours=3)).strftime("%H:%M:%S")[:-3]
    pick_up_time = str(pick_up_time)

    taxiInfo=getTaxiInfo(src_id=src_id,dest_id=dest_id,pick_up_date=pick_up_date,pick_up_time=pick_up_time)["data"]["results"][0]

    print(f"Taxi Info: {taxiInfo}")
    
    queryString=""
    if destStr:
        queryString += f"I want to visit {destStr} for {days} days starting from\n"
    if departureTime:
        queryString += f"My flight is at {departureTime.strftime('%H:%M')} and my cab will reach home at {pick_up_time}.\n"
    if hotelName and hotelPrice:
        queryString += f"I will be staying at {hotelName} and the cost of the stay is {hotelPrice}.\n"
    if durationInMin:
        queryString += f"My flight is of {durationInMin} minutes.\n"
    if arrivalTime:
        queryString += f"I will be arriving in {destStr} at {arrivalTime.strftime('%H:%M')}.\n"
    if 'travelerType' in params:
        queryString += f"I am travelling {params['travelerType']}.\n"
    # if 'stayType' in params:
    #     queryString += f"I want to stay in {params['stayType']}.\n"
    if activities:
        queryString += f"I would love to do the following activities in my trip: {activities}\n"
    queryString += "Could you give me a day wise itinerary with approximate time. Please return the itinerary in JSON format."

    outputJson={}
    outputJson["activities"]=getActivitiesJson(queryString)
    outputJson["flight"]=flightInfo
    outputJson["hotel"]=hotel
    outputJson["taxi"]=taxiInfo

    return json.dumps(outputJson)

@app.route('/claude/getActivities')
def getActivities():
    '''
    params:
    country: str -> Denotes wheter the user wants to visit a specific country or anywhere is fine.
    days: str => Number of days the user wants to travel in string.

    '''
    params = req.args.to_dict()
    queryString=""
    queryString += "I want to visit "+params["country"]+" for " + params["days"] + " days.\n"
    queryString += "I am travelling "+params["travellingWith"]+".\n"
    queryString += "I want to visit places that have "+params["placeType"]+".\n"
    # queryString += "I want to stay in "+params["stayType"]+".\n"
    outputJson=json.dumps(getActivitiesJson(queryString))
    return json.dumps(getActivitiesJson(queryString))

@app.route('/hotels/filterHotels')
def getHotelsApi():
    '''
    params:
    destination: str -> Denotes destination
    arrival_date: str -> Denotes arrival date
    departure_date: str -> Denotes departure date
    '''
    params = req.args.to_dict()

    destQuery = {"query":params["destination"]}

    dest_id=getDestination(destQuery)
    arrival_date = params["arrival_date"]
    departure_date = params["departure_date"]

    hotel=getHotels(dest_id=dest_id,arrival_date=arrival_date,departure_date=departure_date)["data"]["hotels"][0]


@app.route('/taxi/getTaxiDetails')
def getTaxiDetails():
    '''
    params:
    source: str -> Denotes source string
    destination: str -> Denotes destination string
    arrival_date: str -> Denotes arrival date
    departure_date: str -> Denotes departure date
    '''
    params = req.args.to_dict()
    print(params)
    destStr = params["destination"]
    srcStr = params["source"]

    dest_id = getTaxiDestination(destStr)["data"][0]["googlePlaceId"]
    src_id = getTaxiDestination(srcStr)["data"][0]["googlePlaceId"]

    print(dest_id,src_id)
    pick_up_date = params["pick_up_date"]
    pick_up_time = params["pick_up_time"]

    taxiInfo=getTaxiInfo(src_id=src_id,dest_id=dest_id,pick_up_date=pick_up_date,pick_up_time=pick_up_time)["data"]["results"][0]

    return json.dumps(taxiInfo)



if __name__ == '__main__':
    app.run(debug=True)
