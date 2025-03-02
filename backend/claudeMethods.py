import anthropic
from dotenv import load_dotenv
import os
import re
import json

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("ANTHROPIC_API_KEY")
print(api_key)
client = anthropic.Anthropic()

def getActivitiesJson(queryStr:str):
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1000,
        temperature=1,
        system='''You are a travel guide and will return 4 different cities and 4 activities per city that match the user prompt.
        Always return data in a json format. Don't return anything except for the places and activities. 
        Return only a few key words for each activity.
        Return each place in (city, country) format only.
        The json structure is as follows: {"places": [{"location": <city>, "activities": []}]}''',
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": queryStr
                    }
                ]
            }
        ]
    )
    # print(message.content)
    json_data = json.loads(message.content[0].text[7:-3])
    # print(json_data)
    return json_data

def getItineryJson(queryStr:str):
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=2000,
        temperature=1,
        system='''You should generate an itinerary based on the user prompt.
        Return it as a json
        The json structure should be exactly as follows:
        {
            // Flight information
            "flight": {
                "id": "flight-123",
                "price": {
                "raw": 37.9,                // Numeric value for calculations
                "formatted": "$38"          // String with currency symbol
                },
                "legs": [{
                "carriers": {
                    "marketing": [{
                    "name": "Frontier Airlines",
                    "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/F9.png"
                    }]
                },
                "origin": {
                    "displayCode": "LGA",
                    "city": "New York"
                },
                "destination": {
                    "displayCode": "MIA",
                    "city": "Miami"
                },
                "durationInMinutes": 195,
                "departure": "2025-03-10T12:29:00",
                "arrival": "2025-03-10T15:44:00"
                }]
            },
            
            // Hotel information
            "hotel": {
                "hotel_id": 12526017,
                "property": {
                "name": "Women Only Rooms - Men Only Rooms - Free WiFi",
                "accuratePropertyClass": 3,
                "reviewScore": 5.3,
                "reviewCount": 94,
                "reviewScoreWord": "Fair",
                "wishlistName": "Miami",
                "priceBreakdown": {
                    "grossPrice": {
                    "value": 67.5
                    },
                    "excludedPrice": {
                    "value": 9.79
                    },
                    "strikethroughPrice": {
                    "value": 75
                    }
                },
                "photoUrls": [
                    "https://cf.bstatic.com/xdata/images/hotel/square500/641623022.jpg"
                ],
                "checkin": {
                    "fromTime": "00:00"
                },
                "checkout": {
                    "untilTime": "10:00"
                }
                }
            },
            
            // Taxi/transfer information
            "taxi": {
                "price": {
                "amount": "66.94",
                "currencyCode": "USD"
                },
                "supplierName": "E-Life Limo",
                "categoryLocalised": "Standard",
                "duration": 21,
                "drivingDistance": 14.3,
                "passengerCapacity": 3,
                "bags": 3
            },
            
            // Daily activities
            "activities": {
                "1": {
                "title": "Arrival and check-in",
                "activities": [
                    // Format option 1: Strings with time and description
                    "15:44 - Arrive at Miami International Airport",
                    "16:30 - Check-in at accommodation",
                    "19:00 - Dinner at Ocean Drive"
                ]
                },
                "2": {
                "title": "Highlight of the day",
                "activities": [
                    // Format option 2: Objects with time and description
                    {
                    "time": "08:00",
                    "description": "Breakfast at the accommodation"
                    },
                    {
                    "time": "09:30",
                    "description": "Head to South Beach for lounging and swimming"
                    },
                    {
                    "time": "19:00", 
                    "description": "Dinner at Ocean Drive restaurant"
                    }
                ]
                }
            }
        }''',
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": queryStr
                    }
                ]
            }
        ]
    )
    pattern = r"\`\`\`"  # Match digits

    matches = list(re.finditer(pattern, message.content[0].text))
    print(message.content[0].text[matches[0].end()+4:matches[1].start()])
    json_data = json.loads(message.content[0].text[matches[0].end()+4:matches[1].start()])
    print(json_data)
    return json_data
