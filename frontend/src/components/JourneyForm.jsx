import React from 'react'
import LocationInput from './LocationInput'
import DateDurationInput from './DateDurationInput'
import TravelTypeSelector from './TravelTypeSelector'

const JourneyForm = ({
  startLocation,
  setStartLocation,
  startDate,
  setStartDate,
  tripDuration,
  setTripDuration,
  isLoadingLocation,
  locationError,
  getCurrentLocation,
  handleSubmit,
  formSubmitted,
  travelType,
  handleTravelTypeSelect
}) => {
  return (
    <div className="form-container">
      <h2>Your Journey Details</h2>

      {!formSubmitted ? (
        <form className="modern-form">
          <LocationInput
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            isLoadingLocation={isLoadingLocation}
            locationError={locationError}
            getCurrentLocation={getCurrentLocation}
          />

          <DateDurationInput
            startDate={startDate}
            setStartDate={setStartDate}
            tripDuration={tripDuration}
            setTripDuration={setTripDuration}
          />

          <button type="submit" className="submit-button" onClick={handleSubmit}>
            Let's go
          </button>
        </form>
      ) : (
        <TravelTypeSelector
          travelType={travelType}
          onSelectType={handleTravelTypeSelect}
          tripDuration={tripDuration}
          tripStartDate={startDate}
          startLocation={startLocation}
        />
      )}
    </div>
  )
}

export default JourneyForm