import React from 'react'
import styles from './LocationInput.module.css'

const LocationInput = ({ 
  startLocation, 
  setStartLocation, 
  isLoadingLocation, 
  locationError, 
  getCurrentLocation 
}) => {
  return (
    <div className={styles.formGroup}>
      <label>Starting Point</label>
      <div className={styles.locationInputGroup}>
        <input
          type="text"
          placeholder="Your starting location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <button
          type="button"
          className={styles.locationButton}
          onClick={getCurrentLocation}
        >
          <i className={styles.locationIcon}>📍</i>
        </button>
      </div>
      {locationError && <p className={styles.errorText}>{locationError}</p>}
      {isLoadingLocation && <p className={styles.loadingText}>Getting your location...</p>}
    </div>
  )
}

export default LocationInput