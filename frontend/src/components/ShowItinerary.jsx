import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ShowItinerary.module.css';

const ShowItinerary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        rankedActivities,
        tripDetails,
        itinerary,
        selectedLocation
    } = location.state || {};

    const [activeTab, setActiveTab] = useState('overview');
    const [expandedDay, setExpandedDay] = useState(0);
    const [editingItem, setEditingItem] = useState(null);
    const [showFlightOptions, setShowFlightOptions] = useState(false);
    const [showAccommodationOptions, setShowAccommodationOptions] = useState(false);

    // Parse the itinerary data - assuming it has days, flights, accommodation
    const { days = [], flights = [], accommodation = [] } = itinerary || {};

    // Handle day expansion
    const toggleDayExpansion = (dayIndex) => {
        setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
    };

    // Handle activity editing
    const startEditing = (type, id) => {
        setEditingItem({ type, id });
    };

    // Save edited activity
    const saveEdit = () => {
        // Here you would typically make an API call to update the itinerary
        setEditingItem(null);
    };

    // Replace an activity
    const replaceActivity = (dayIndex, activityIndex, newActivity) => {
        // Here you would update the itinerary
        console.log(`Replacing activity ${activityIndex} on day ${dayIndex} with ${newActivity}`);
    };

    return (
        <div className={styles.itineraryContainer}>
            <div className={styles.itineraryHeader}>
                <h1>Your Trip to {selectedLocation}</h1>
                <p className={styles.tripDuration}>
                    {tripDetails.duration} day journey from {tripDetails.location}
                </p>
            </div>

            {/* Tab navigation */}
            <div className={styles.tabNavigation}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'day-by-day' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('day-by-day')}
                >
                    Day by Day
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'flights' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('flights')}
                >
                    Flights
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'stay' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('stay')}
                >
                    Where to Stay
                </button>
            </div>

            {/* Overview tab */}
            {activeTab === 'overview' && (
                <div className={styles.overviewTab}>
                    <div className={styles.tripCard}>
                        <div className={styles.tripSummary}>
                            <h2>Trip Summary</h2>
                            <div className={styles.summaryDetails}>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Destination:</span>
                                    <span>{selectedLocation}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Duration:</span>
                                    <span>{tripDetails.duration} days</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Travel style:</span>
                                    <span>{tripDetails.travelType} trip {tripDetails.travelers && `(${tripDetails.travelers})`}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Vibe:</span>
                                    <span>{tripDetails.vibe || 'Relaxed'}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tripHighlights}>
                            <h3>Trip Highlights</h3>
                            <ul className={styles.highlightsList}>
                                {rankedActivities.slice(0, 3).map((activity, index) => (
                                    <li key={index} className={styles.highlightItem}>
                                        <span className={styles.highlightIcon}>✨</span>
                                        <span>{activity.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.overviewMap}>
                        {/* Map placeholder - You would integrate a real map here */}
                        <div className={styles.mapPlaceholder}>
                            <span>Interactive Map Coming Soon</span>
                        </div>
                    </div>

                    <button
                        className={styles.viewDetailsButton}
                        onClick={() => setActiveTab('day-by-day')}
                    >
                        View Detailed Itinerary
                    </button>
                </div>
            )}

            {/* Day by Day tab */}
            {activeTab === 'day-by-day' && (
                <div className={styles.dayByDayTab}>
                    {days.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className={`${styles.dayCard} ${expandedDay === dayIndex ? styles.expanded : ''}`}
                        >
                            <div
                                className={styles.dayHeader}
                                onClick={() => toggleDayExpansion(dayIndex)}
                            >
                                <h3>Day {dayIndex + 1}</h3>
                                <span className={styles.expandIcon}>
                                    {expandedDay === dayIndex ? '▼' : '▶'}
                                </span>
                            </div>

                            {expandedDay === dayIndex && (
                                <div className={styles.dayDetails}>
                                    <div className={styles.daySchedule}>
                                        {day.activities && day.activities.map((activity, actIndex) => (
                                            <div key={actIndex} className={styles.activityItem}>
                                                <div className={styles.activityTime}>
                                                    {activity.time || `${9 + actIndex * 2}:00`}
                                                </div>
                                                <div className={styles.activityContent}>
                                                    <h4>{activity.title || activity}</h4>
                                                    {activity.description && <p>{activity.description}</p>}

                                                    <div className={styles.activityActions}>
                                                        <button
                                                            className={styles.editButton}
                                                            onClick={() => startEditing('activity', `${dayIndex}-${actIndex}`)}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            className={styles.replaceButton}
                                                            onClick={() => setShowActivityOptions(true)}
                                                        >
                                                            🔄 Replace
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className={styles.addActivityButton}>
                                        + Add Activity
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Flights tab */}
            {activeTab === 'flights' && (
                <div className={styles.flightsTab}>
                    <div className={styles.flightOptions}>
                        <h2>Flight Options</h2>
                        {flights.length > 0 ? (
                            flights.map((flight, index) => (
                                <div key={index} className={styles.flightCard}>
                                    <div className={styles.flightHeader}>
                                        <div className={styles.flightAirline}>
                                            {flight.airline || 'Recommended Airline'}
                                        </div>
                                        <div className={styles.flightPrice}>
                                            {flight.price || '$299'}
                                        </div>
                                    </div>

                                    <div className={styles.flightDetails}>
                                        <div className={styles.flightRoute}>
                                            <div className={styles.departureTo}>
                                                <div className={styles.airportCode}>{flight.departureCode || 'DEP'}</div>
                                                <div className={styles.flightTime}>{flight.departureTime || '9:00 AM'}</div>
                                            </div>

                                            <div className={styles.flightDuration}>
                                                <div className={styles.durationLine}></div>
                                                <div className={styles.durationTime}>{flight.duration || '2h 15m'}</div>
                                            </div>

                                            <div className={styles.arrivalTo}>
                                                <div className={styles.airportCode}>{flight.arrivalCode || 'ARR'}</div>
                                                <div className={styles.flightTime}>{flight.arrivalTime || '11:15 AM'}</div>
                                            </div>
                                        </div>

                                        <button className={styles.selectFlightButton}>
                                            Select Flight
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noFlightsMessage}>
                                <p>We'll find the best flights for your trip soon!</p>
                                <button className={styles.searchFlightsButton}>
                                    Search Flights
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Accommodations tab */}
            {activeTab === 'stay' && (
                <div className={styles.stayTab}>
                    <div className={styles.accommodationOptions}>
                        <h2>Where to Stay</h2>

                        {accommodation.length > 0 ? (
                            accommodation.map((hotel, index) => (
                                <div key={index} className={styles.hotelCard}>
                                    <div
                                        className={styles.hotelImage}
                                        style={{
                                            backgroundImage: hotel.image
                                                ? `url(${hotel.image})`
                                                : 'linear-gradient(135deg, #6e8efb, #a777e3)'
                                        }}
                                    >
                                        <div className={styles.hotelPrice}>
                                            {hotel.price || '$120'}<span>/night</span>
                                        </div>
                                    </div>

                                    <div className={styles.hotelDetails}>
                                        <h3>{hotel.name || 'Recommended Hotel'}</h3>
                                        <div className={styles.hotelRating}>
                                            {'★'.repeat(hotel.rating || 4)}
                                            {'☆'.repeat(5 - (hotel.rating || 4))}
                                        </div>
                                        <p className={styles.hotelDescription}>
                                            {hotel.description || 'A comfortable place to stay during your trip.'}
                                        </p>

                                        <div className={styles.hotelAmenities}>
                                            {(hotel.amenities || ['WiFi', 'Pool', 'Breakfast']).map((amenity, i) => (
                                                <span key={i} className={styles.amenityTag}>{amenity}</span>
                                            ))}
                                        </div>

                                        <button className={styles.viewHotelButton}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noHotelsMessage}>
                                <p>We'll find the perfect accommodations for your trip soon!</p>
                                <button className={styles.searchHotelsButton}>
                                    Search Hotels
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.itineraryActions}>
                <button
                    className={styles.editItineraryButton}
                    onClick={() => console.log('Edit full itinerary')}
                >
                    Edit Itinerary
                </button>
                <button
                    className={styles.saveItineraryButton}
                    onClick={() => console.log('Save itinerary')}
                >
                    Save Itinerary
                </button>
                <button
                    className={styles.shareItineraryButton}
                    onClick={() => console.log('Share itinerary')}
                >
                    Share
                </button>
            </div>
        </div>
    );
};

export default ShowItinerary;