import { useState } from 'react'
import './App.css'
import Topbar from './components/Topbar'
import LandingPage from './components/LandingPage'
import JourneyForm from './components/JourneyForm'
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
          const formattedLocation = await getCurrentLocationFromAPI(position)
          setStartLocation(formattedLocation)
          setIsLoadingLocation(false)
        } catch (error) {
          console.error("Error fetching location:", error)
          setStartLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
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
    <div className="app-container">
      <Topbar />
      
      <div className="content">
        {!started ? (
          <LandingPage onStart={() => setStarted(true)} />
        ) : (
          <JourneyForm
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            startDate={startDate}
            setStartDate={setStartDate}
            tripDuration={tripDuration}
            setTripDuration={setTripDuration}
            isLoadingLocation={isLoadingLocation}
            locationError={locationError}
            getCurrentLocation={getCurrentLocation}
            handleSubmit={handleSubmit}
            formSubmitted={formSubmitted}
            travelType={travelType}
            handleTravelTypeSelect={handleTravelTypeSelect}
          />
        )}
      </div>
    </div>
  )
}

export default App