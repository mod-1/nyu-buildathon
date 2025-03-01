from flask import Flask,request as req
from claudeMethods import getItineryJson,getActivitiesJson
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
    country: str -> Denotes wheter the user wants to visit a specific country or anywhere is fine.
    days: str => Number of days the user wants to travel in string.
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
def getHotels():
    '''
    params:
    category: str -> Denotes the category from (hotel, homestay, villa, resort)


    '''
    querystring = {"query":"Gulmarg"}

    querystring = {
        "dest_id":"-2092174",
        "search_type":"CITY",
        "arrival_date":
        "2025-03-04","departure_date":"2025-03-20","adults":"1","children_age":"0,17","room_qty":"1","page_number":"1","sort_by":"price","categories_filter":"hotel","units":"metric","temperature_unit":"c","languagecode":"en-us","currency_code":"USD"}



if __name__ == '__main__':
    app.run(debug=True)
