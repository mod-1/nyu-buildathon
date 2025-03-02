import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './TravelTypeSelector.module.css'

// Reusable selection card component
const SelectionCard = ({ type, icon, label, onClick, imageClass, cardClass }) => (
  <div className={cardClass} onClick={() => onClick(type)}>
    <div className={imageClass}>
      <span>{icon}</span>
    </div>
    <p>{label}</p>
  </div>
);

const TravelTypeSelector = ({ travelType, onSelectType, tripDuration, tripStartDate, startLocation, startLocationCoordinates }) => {
  const navigate = useNavigate();

  const [selectedVibe, setSelectedVibe] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [currentSection, setCurrentSection] = useState('travel');
  const [isLoading, setIsLoading] = useState(false);
  const travelersSectionRef = useRef(null);

  // Generic selection handler with animation
  const handleSelection = (selectionType, setter) => {
    setAnimatingOut(true);
    setTimeout(() => {
      setter(selectionType);
      setAnimatingOut(false);
    }, 300);
  };

  const handleTravelerSelect = async (travelerType) => {
    setIsLoading(true);

    try {
      // Map travelers type to appropriate phrases
      let travellingWithPhrase;
      switch (travelerType) {
        case 'solo': travellingWithPhrase = 'solo'; break;
        case 'couple': travellingWithPhrase = 'with my partner'; break;
        case 'friends': travellingWithPhrase = 'with my friends'; break;
        default: travellingWithPhrase = 'solo';
      }

      // Format request parameters according to API expectations
      const params = {
        country: travelType === 'domestic'
          ? extractCountry(startLocation) // Extract country from startLocation
          : 'internationally',
        days: tripDuration,
        travellingWith: travellingWithPhrase,
        placeType: selectedVibe // snow, beach, forest, desert
      };

      // Convert params to URL search parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });

      const url = `/claude/getActivities?${queryParams.toString()}`;


      // Function to extract country from startLocation
      function extractCountry(location) {
        if (!location) return 'the United States'; // Default fallback

        // Parse location in format "city; country"
        const parts = location.split(';');
        console.log("city; country", parts)
        if (parts.length >= 2) {
          // Get country part and trim whitespace
          const country = parts[1].trim();
          return country;
        }

        // Fallback if format is not as expected
        return 'the United States';
      }

      function extractCity(location) {
        if (!location) return 'the United States'; // Default fallback

        // Parse location in format "city; country"
        const parts = location.split(';');
        console.log("city; country", parts)
        if (parts.length >= 1) {
          // Get country part and trim whitespace
          const city = parts[0].trim();
          return city;
        }

        // Fallback if format is not as expected
        return 'New York';
      }
      // Original data for debugging
      const tripData = {
        travelType,
        vibe: selectedVibe,
        travelers: travelerType,
        duration: tripDuration,
        startLocation: startLocation
      };

      console.log('Original trip data:', tripData);
      console.log('Formatted params:', params);

      // Send data to your backend
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const flattenedActivities = {};

      data.places.forEach(place => {
        place.activities.forEach(activity => {
          flattenedActivities[activity] = place.name;
        });
      });
      console.log('Trip suggestions received:', data);
      navigate('/activity-comparison', {
        state: {
          activities: flattenedActivities,
          tripDetails: {
            travelType,
            vibe: selectedVibe,
            travelers: travelerType,
            duration: tripDuration,
            startDate: tripStartDate,
            location: extractCity(startLocation),
            startLocationCoordinates: startLocationCoordinates
          }
        }
      });

    } catch (error) {
      console.error('Error sending trip data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update current section based on selections
  useEffect(() => {
    if (selectedVibe) {
      setCurrentSection('travelers');
    } else if (travelType) {
      setCurrentSection('vibe');
    } else {
      setCurrentSection('travel');
    }
  }, [travelType, selectedVibe]);

  // Define selections for each step
  const travelOptions = [
    { type: 'domestic', icon: '🏕️', label: 'Domestic' },
    { type: 'international', icon: '✈️', label: 'International' }
  ];

  const vibeOptions = [
    { type: 'snow', icon: '❄️', label: 'Snow' },
    { type: 'beach', icon: '🏖️', label: 'Beach' },
    { type: 'forest', icon: '🌲', label: 'Forest' },
    { type: 'desert', icon: '🏜️', label: 'Desert' }
  ];

  const travelerOptions = [
    { type: 'solo', icon: '👤', label: 'Solo' },
    { type: 'couple', icon: '👫', label: 'Couple' },
    { type: 'friends', icon: '👥', label: 'Friends' }
  ];

  // Helper to get section title
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'travel': return 'Where would you like to travel?';
      case 'vibe': return 'What vibe are you looking for?';
      case 'travelers': return 'How many people will be going?';
      default: return '';
    }
  };

  return (
    <div className={styles.travelTypeSection}>
      <h3>{getSectionTitle()}</h3>

      <div className={styles.contentContainer}>
        {/* Travel Type Section */}
        <div className={`${styles.sectionContent} ${currentSection === 'travel' ? styles.active : styles.hidden}`}>
          <div className={styles.travelOptionsGrid}>
            {travelOptions.map(option => (
              <SelectionCard
                key={option.type}
                type={option.type}
                icon={option.icon}
                label={option.label}
                onClick={(type) => handleSelection(type, onSelectType)}
                imageClass={`${styles.travelOptionImage} ${styles[option.type]}`}
                cardClass={styles.travelOptionCard}
              />
            ))}
          </div>
        </div>

        {/* Vibe Section */}
        <div className={`${styles.sectionContent} ${currentSection === 'vibe' ? styles.active : styles.hidden}`}>
          <div className={styles.vibeOptions}>
            {vibeOptions.map(option => (
              <SelectionCard
                key={option.type}
                type={option.type}
                icon={option.icon}
                label={option.label}
                onClick={(vibe) => handleSelection(vibe, setSelectedVibe)}
                imageClass={`${styles.vibeImage} ${styles[option.type]}`}
                cardClass={styles.vibeOption}
              />
            ))}
          </div>
        </div>

        {/* Travelers Section */}
        <div
          ref={travelersSectionRef}
          className={`${styles.sectionContent} ${currentSection === 'travelers' ? styles.active : styles.hidden}`}
        >
          <div className={styles.travelersGrid}>
            {travelerOptions.map(option => (
              <SelectionCard
                key={option.type}
                type={option.type}
                icon={option.icon}
                label={option.label}
                onClick={() => handleTravelerSelect(option.type)}
                imageClass={`${styles.travelerImage} ${styles[option.type]}`}
                cardClass={`${styles.travelerCard} ${isLoading ? styles.disabled : ''}`}
              />
            ))}
          </div>

          {isLoading && (
            <div className={styles.loadingIndicator}>
              <p>Finding the perfect trip for you...</p>
              <div className={styles.spinner}></div>
            </div>
          )}
        </div>
      </div>

      {/* Progress indicators */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${currentSection === 'travel' ? styles.active : ''}`}></div>
        <div className={`${styles.step} ${currentSection === 'vibe' ? styles.active : ''}`}></div>
        <div className={`${styles.step} ${currentSection === 'travelers' ? styles.active : ''}`}></div>
      </div>
    </div>
  );
};

export default TravelTypeSelector;