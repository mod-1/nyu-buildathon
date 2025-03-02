import anthropic
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("ANTHROPIC_API_KEY")
print(api_key)


client = anthropic.Anthropic(
    # Replace with your API key
    api_key=api_key,
)

# Define your JSON schema tool
json_tool = {
    "name": "get_structured_data",
    "description": "Returns data in a specific JSON structure",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query to process"
            }
        },
        "required": ["query"]
    }
}

# Make the API call with the tool
message = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1000,
    tools=[json_tool],
    messages=[
        {
            "role": "user",
            "content": "Provide information about the top 3 cloud providers in a structured format."
        }
    ]
)

# Extract the JSON response
print(message.content)
for content in message.content:
    if hasattr(content, 'tool_use'):
        json_response = content.tool_use.input
        print(json.dumps(json_response, indent=2))
