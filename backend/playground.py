import anthropic
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("ANTHROPIC_API_KEY")
print(api_key)
client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1000,
    temperature=1,
    system="You are a json emitter",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Top 3 places to go in Haridwar"
                }
            ]
        }
    ]
)
json_data = json.loads(message.content[0].text[7:-3])
print(json_data)
