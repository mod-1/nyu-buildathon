import React, { useRef, useEffect, useState } from 'react'
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

const TravelTypeSelector = ({ travelType, onSelectType }) => {
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [currentSection, setCurrentSection] = useState('travel');
  const travelersSectionRef = useRef(null);

  // Generic selection handler with animation
  const handleSelection = (selectionType, setter) => {
    setAnimatingOut(true);
    setTimeout(() => {
      setter(selectionType);
      setAnimatingOut(false);
    }, 300);
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
    switch(currentSection) {
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
                onClick={() => console.log(`Selected: ${option.type}`)}
                imageClass={`${styles.travelerImage} ${styles[option.type]}`}
                cardClass={styles.travelerCard}
              />
            ))}
          </div>
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