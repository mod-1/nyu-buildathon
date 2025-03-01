from flask import Flask,request as req
from claudeMethods import getItineryJson,getActivitiesJson
import json
app = Flask(__name__)

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
    queryString += "I want to visit places that are "+params["placeType"]+".\n"
    # queryString += "I want to stay in "+params["stayType"]+".\n"

    return json.dumps(getActivitiesJson(queryString))



if __name__ == '__main__':
    app.run(debug=True)
