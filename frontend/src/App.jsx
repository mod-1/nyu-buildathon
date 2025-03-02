import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Topbar from './components/Topbar'
import LandingPage from './components/LandingPage'
import JourneyForm from './components/JourneyForm'
import ActivityComparison from "./components/ActivityComparision"
import ShowItinerary from './components/ShowItinerary';
import { getCurrentLocationFromAPI } from './services/locationService'

function App() {
  const [started, setStarted] = useState(false)
  const [startLocation, setStartLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [tripDuration, setTripDuration] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [travelType, setTravelType] = useState(null)
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null })

  const resetAppState = () => {
    setStarted(false);
    setStartLocation('');
    setStartDate('');
    setTripDuration('');
    setIsLoadingLocation(false);
    setLocationError('');
    setFormSubmitted(false);
    setTravelType(null);
    setCoordinates({ latitude: null, longitude: null });
  }

  // Function to get current location using browser's Geolocation API
  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { formattedLocation, coordinates } = await getCurrentLocationFromAPI(position)
          setStartLocation(formattedLocation)
          setCoordinates(coordinates)
          setIsLoadingLocation(false)
        } catch (error) {
          console.error("Error fetching location:", error)
          setStartLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location')
        setIsLoadingLocation(false)
      }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      startLocation,
      startDate,
      tripDuration
    })
    setFormSubmitted(true)
  }

  const handleTravelTypeSelect = (type) => {
    setTravelType(type)
    console.log(`Selected travel type: ${type}`)
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Topbar resetAppState={resetAppState} />

        <div className="content">
          <Routes>
            <Route path="/" element={
              !started ? (
                <LandingPage onStart={() => setStarted(true)} />
              ) : (
                <JourneyForm
                  startLocation={startLocation}
                  setStartLocation={setStartLocation}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  tripDuration={tripDuration}
                  setTripDuration={setTripDuration}
                  coordinates={coordinates}
                  isLoadingLocation={isLoadingLocation}
                  locationError={locationError}
                  getCurrentLocation={getCurrentLocation}
                  handleSubmit={handleSubmit}
                  formSubmitted={formSubmitted}
                  travelType={travelType}
                  handleTravelTypeSelect={handleTravelTypeSelect}
                />
              )
            } />
            <Route
              path="/activity-comparison"
              element={<ActivityComparison />}
            />
            <Route path="/show-itinerary" element={<ShowItinerary />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App