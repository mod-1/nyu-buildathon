# VoyagHere - AI-Powered Travel Planning

VoyagHere is an intelligent travel planning application that helps users create personalized itineraries based on their preferences, travel style, and desired destinations.

## VoyagHere Logo

![VoyagHere Logo](frontend/public/logo.jpeg)

## Features

- **Smart Destination Suggestions:** Get tailored destination recommendations based on your travel preferences
- **Activity Comparison:** Choose between activities that appeal to you most
- **Personalized Itineraries:** Generate day-by-day itineraries with specific activities and times
- **Flight & Hotel Integration:** View flight options and accommodations for your trip
- **Cost Breakdown:** See estimated costs for your entire journey
- **Customizable Plans:** Edit and refine your itinerary as needed

## Tech Stack

### Frontend

- React 19
- React Router
- CSS Modules
- Vite

### Backend

- Flask
- Anthropic Claude API for AI-powered recommendations
- Booking.com API for hotel information
- Sky Scrapper API for flight details

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- API keys for Claude, Booking.com, and Sky Scrapper APIs

### Backend Setup

```sh
# Clone the repository
git clone https://github.com/mod-1/nyu-buildathon.git
cd nyu-buildathon/backend

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the backend directory with the following:
# CLAUDE_API_KEY=your_claude_api_key
# BOOKING_API_KEY=your_booking_api_key
# SKY_SCRAPPER_API_KEY=your_sky_scrapper_api_key
```

### Frontend Setup

```sh
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Start the backend server

```sh
cd backend
flask run
```

### Start the frontend development server

```sh
cd frontend
npm run dev
```

### Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## Usage

1. **Start your journey:** Click the "Start" button on the landing page
2. **Enter trip details:** Specify your starting location, dates, and trip duration
3. **Select travel preferences:** Choose domestic or international travel and your preferred environment (beach, snow, forest, desert)
4. **Compare activities:** Select between different suggested activities to help personalize your recommendations
5. **Review your itinerary:** Explore your personalized day-by-day trip plan
6. **Make adjustments:** Edit activities, view flight options, and check accommodation details

## Project Structure

```
voyaghere/
├── backend/
│   ├── app.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Screenshots

![Screenshot 1](path/to/screenshot1.png)
![Screenshot 2](path/to/screenshot2.png)

## Contributors

- [Your Name]
- [Team Member 1]
- [Team Member 2]

## License

This project is licensed under the MIT License - feel free to use and modify as needed.

---

**Built for the NYU Buildathon**
