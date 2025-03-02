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

    // Format the flight data
    const flightData = itinerary?.flight;
    const flight = flightData ? {
        id: flightData.id,
        price: flightData.price.formatted,
        airline: flightData.legs[0].carriers.marketing[0].name,
        departureCode: flightData.legs[0].origin.displayCode,
        arrivalCode: flightData.legs[0].destination.displayCode,
        departureCity: flightData.legs[0].origin.city,
        arrivalCity: flightData.legs[0].destination.city,
        departureTime: new Date(flightData.legs[0].departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        arrivalTime: new Date(flightData.legs[0].arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${Math.floor(flightData.legs[0].durationInMinutes / 60)}h ${flightData.legs[0].durationInMinutes % 60}m`,
        date: new Date(flightData.legs[0].departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } : null;

    // Format the hotel data
    const hotelData = itinerary?.hotel;
    const hotel = hotelData ? {
        id: hotelData.hotel_id,
        name: hotelData.property.name,
        rating: hotelData.property.accuratePropertyClass,
        reviewScore: hotelData.property.reviewScore,
        reviewCount: hotelData.property.reviewCount,
        reviewWord: hotelData.property.reviewScoreWord,
        price: hotelData.property.priceBreakdown.grossPrice.value,
        formattedPrice: `$${Math.round(hotelData.property.priceBreakdown.grossPrice.value)}`,
        taxes: `$${Math.round(hotelData.property.priceBreakdown.excludedPrice.value)}`,
        originalPrice: `$${Math.round(hotelData.property.priceBreakdown.grossPrice.value)}`,
        image: hotelData.property.photoUrls[0],
        checkin: hotelData.property.checkin.fromTime,
        checkout: hotelData.property.checkout.untilTime,
        location: hotelData.property.wishlistName,
        roomType: "Entire studio – 28 m²",
        amenities: ["Free WiFi", "Free cancellation", "Air conditioning", "Kitchen"]
    } : null;

    // Format taxi data
    const taxiData = itinerary?.taxi;
    const taxi = taxiData ? {
        price: `$${taxiData.price.amount}`,
        supplier: taxiData.supplierName,
        category: taxiData.categoryLocalised,
        duration: `${taxiData.duration} min`,
        distance: `${taxiData.drivingDistance} miles`,
        passengers: taxiData.passengerCapacity,
        bags: taxiData.bags
    } : null;

    // Create days array from NEW activities structure
    const activitiesData = itinerary?.activities || {};
    const daysData = Object.keys(activitiesData).map(dayNum => ({
        number: parseInt(dayNum),
        title: activitiesData[dayNum].date,
        activities: activitiesData[dayNum].activities
    }));

    // Get a few key highlights from the itinerary
    const highlights = daysData.slice(0, 3).map(day => {
        // Get one significant activity from each day (first one or one in the afternoon if available)
        const highlightActivity = day.activities.find(act =>
            act.time.includes("14:") || act.time.includes("15:") || act.time.includes("16:")
        ) || day.activities[0];

        return {
            day: day.title,
            activity: highlightActivity.description
        };
    });

    // Calculate total cost estimate
    const flightCost = flightData ? flightData.price.raw : 0;
    const hotelCost = hotelData ? hotelData.property.priceBreakdown.grossPrice.value + hotelData.property.priceBreakdown.excludedPrice.value : 0;
    const taxiCost = taxiData ? parseFloat(taxiData.price.amount) * 2 : 0; // Assume round trip
    const dailyExpensesCost = 100 * daysData.length; // Estimate $100 per day for food, attractions, etc.
    const totalCost = flightCost + hotelCost + taxiCost + dailyExpensesCost;

    // Handle day expansion
    const toggleDayExpansion = (dayIndex) => {
        setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
    };

    return (
        <div className={styles.itineraryContainer}>
            <div className={styles.itineraryHeader}>
                <h1>Your Trip to {selectedLocation || "Olympic National Park"}</h1>
                <p className={styles.tripDuration}>
                    {daysData.length} day journey from {flight?.departureCity || "New York"}
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
                                    <span>{selectedLocation || "Olympic National Park, WA"}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Duration:</span>
                                    <span>{daysData.length} days</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Travel style:</span>
                                    <span>{tripDetails?.travelType || "Nature"} trip</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Vibe:</span>
                                    <span>{tripDetails?.vibe || "Adventure"}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Estimated Total Cost:</span>
                                    <span>${Math.round(totalCost)}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tripHighlights}>
                            <h3>Trip Highlights</h3>
                            <ul className={styles.highlightsList}>
                                {highlights.map((highlight, index) => (
                                    <li key={index} className={styles.highlightItem}>
                                        <span className={styles.highlightIcon}>✨</span>
                                        <span>{highlight.day}: {highlight.activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={styles.costBreakdown}>
                        <h3>Cost Breakdown</h3>
                        <div className={styles.costItem}>
                            <span className={styles.costLabel}>Flight:</span>
                            <span className={styles.costValue}>{flight?.price || "$2,238"}</span>
                        </div>
                        <div className={styles.costItem}>
                            <span className={styles.costLabel}>Accommodation:</span>
                            <span className={styles.costValue}>{hotel?.formattedPrice || "$400"} + {hotel?.taxes || "$52"} taxes</span>
                        </div>
                        <div className={styles.costItem}>
                            <span className={styles.costLabel}>Airport Transfer:</span>
                            <span className={styles.costValue}>{taxi?.price || "$70"} (one way)</span>
                        </div>
                        <div className={styles.costItem}>
                            <span className={styles.costLabel}>Daily Expenses (est.):</span>
                            <span className={styles.costValue}>${dailyExpensesCost}</span>
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
                <div className={styles.daysContainer}>
                    {daysData.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className={`${styles.dayCard} ${expandedDay === dayIndex ? styles.expanded : ''}`}
                        >
                            <div
                                className={`${styles.dayHeader} ${expandedDay === dayIndex ? styles.expandedHeader : ''}`}
                                onClick={() => toggleDayExpansion(dayIndex)}
                            >
                                <h3>{day.title || `Day ${dayIndex + 1}`}</h3>
                                <span className={styles.expandIcon}>
                                    {expandedDay === dayIndex ? '▼' : '▶'}
                                </span>
                            </div>

                            {/* Only render content when expanded for better performance */}
                            {expandedDay === dayIndex && (
                                <div className={styles.dayDetails}>
                                    <div className={styles.daySchedule}>
                                        {day.activities && day.activities.map((activity, actIndex) => (
                                            <div key={actIndex} className={styles.activityItem}>
                                                <div className={styles.activityTime}>
                                                    {activity.time}
                                                </div>
                                                <div className={styles.activityContent}>
                                                    <p>{activity.description}</p>
                                                    <div className={styles.activityActions}>
                                                        <button className={styles.editButton}>✏️ Edit</button>
                                                        <button className={styles.replaceButton}>🔄 Replace</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={styles.addActivityButton}>+ Add Activity</button>
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
                        {flight ? (
                            <div className={styles.flightCard}>
                                <div className={styles.flightHeader}>
                                    <div className={styles.flightAirline}>
                                        {flight.airline}
                                    </div>
                                    <div className={styles.flightPrice}>
                                        {flight.price}
                                    </div>
                                </div>

                                <div className={styles.flightDetails}>
                                    <div className={styles.flightRoute}>
                                        <div className={styles.departureTo}>
                                            <div className={styles.airportCode}>{flight.departureCode}</div>
                                            <div className={styles.flightTime}>{flight.departureTime}</div>
                                            <div>{flight.date}</div>
                                        </div>

                                        <div className={styles.flightDuration}>
                                            <div className={styles.durationLine}></div>
                                            <div className={styles.durationTime}>{flight.duration}</div>
                                        </div>

                                        <div className={styles.arrivalTo}>
                                            <div className={styles.airportCode}>{flight.arrivalCode}</div>
                                            <div className={styles.flightTime}>{flight.arrivalTime}</div>
                                            <div>{new Date(flightData.legs[0].arrival).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        </div>
                                    </div>

                                    <button className={styles.selectFlightButton}>
                                        Book Flight
                                    </button>
                                </div>
                            </div>
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

                        {hotel ? (
                            <div className={styles.hotelCard}>
                                <div
                                    className={styles.hotelImage}
                                    style={{ backgroundImage: `url(${hotel.image})` }}
                                >
                                    <div className={styles.hotelPrice}>
                                        {hotel.formattedPrice}<span>/night</span>
                                    </div>
                                </div>

                                <div className={styles.hotelDetails}>
                                    <h3>{hotel.name}</h3>
                                    <div className={styles.hotelRating}>
                                        {'★'.repeat(hotel.rating)}
                                        {'☆'.repeat(5 - hotel.rating)}
                                        <span> • {hotel.reviewScore}/10 ({hotel.reviewWord}, {hotel.reviewCount} reviews)</span>
                                    </div>
                                    <p className={styles.hotelDescription}>
                                        {hotel.roomType} in {hotel.location}
                                    </p>
                                    <p>Check-in: {hotel.checkin} • Check-out: {hotel.checkout}</p>
                                    <p>Original price: <strike>{hotel.originalPrice}</strike> • Current price: {hotel.formattedPrice} + {hotel.taxes} taxes</p>

                                    <div className={styles.hotelAmenities}>
                                        {hotel.amenities.map((amenity, i) => (
                                            <span key={i} className={styles.amenityTag}>{amenity}</span>
                                        ))}
                                    </div>

                                    <button className={styles.viewHotelButton}>
                                        View Details
                                    </button>
                                </div>
                            </div>
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
                <button className={styles.editItineraryButton}>
                    Edit Itinerary
                </button>
                <button className={styles.saveItineraryButton}>
                    Save Itinerary
                </button>
                <button className={styles.shareItineraryButton}>
                    Share
                </button>
            </div>
        </div>
    );
};

export default ShowItinerary;