from flask import Flask,request as req
from claudeMethods import getItineryJson,getActivitiesJson
from bookingMethods import getDestination,getHotels
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

@app.route('/claude/generateItinerary')
def getItinerary():
    '''
    params:
    country: str -> Denotes country
    days: str -> Denotes number of days
    travellingWith: str -> Denotes who the user is travelling with
    placeType: str -> Denotes type of place
    '''
    params = req.args.to_dict()
    queryString=""
    queryString += "I want to visit "+params["country"]+" for " + params["days"] + " days.\n"
    queryString += "I am travelling "+params["travellingWith"]+".\n"
    queryString += "I want to visit places that are "+params["placeType"]+".\n"
    # queryString += "I want to stay in "+params["stayType"]+".\n"
    queryString += "I would love to do the follwing activities in my trip: "+"\n".join(params["activities"])+"\n"

    return json.dumps(getItineryJson(queryString))

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

    hotel=getHotels(dest_id=dest_id,arrival_date=arrival_date,departure_date=departure_date)
    print(hotel)
    return json.dumps(hotel["data"]["hotels"][0])

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
