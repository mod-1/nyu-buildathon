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
        system="You are a travel guide and would return 4 places and 4 subjects of activities per place that match the user prompt. Return data in a json format. Don't return anything except for the places and activities",
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
    print(message.content)
    json_data = json.loads(message.content[0].text[7:-3])
    print(json_data)
    return json_data

def getItineryJson(queryStr:str):
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=2000,
        temperature=1,
        system="You are an itinerary generator based on the user prompt and return it as a json with step number as key and the details as value",
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
