import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ActivityComparision.module.css';

const ActivityComparison = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { activities, tripDetails } = location.state || { activities: {}, tripDetails: {} };

    const [allActivities, setAllActivities] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [rankings, setRankings] = useState({});
    const [comparisonsCount, setComparisonsCount] = useState(0);
    const [comparisonsDone, setComparisonsDone] = useState(false);
    const [comparedPairs, setComparedPairs] = useState(new Set());
    const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);

    // Maximum comparisons we'll ask the user to make
    const MAX_COMPARISONS = Math.min(10, Object.keys(activities).length * 2); // Adjust as needed

    // Initialize activities from the object
    useEffect(() => {
        if (activities && typeof activities === 'object') {
            const activityArray = Object.keys(activities).map(activity => ({
                text: activity,
                location: activities[activity]
            }));

            setAllActivities(activityArray);

            // Initialize rankings object with 1000 points for each activity (ELO starting value)
            const initialRankings = {};
            activityArray.forEach(activity => {
                initialRankings[activity.text] = 1000;
            });
            setRankings(initialRankings);

            // Select first pair to compare
            if (activityArray.length >= 2) {
                selectRandomPair(activityArray);
            }
        }
    }, [activities]);


    const selectRandomPair = (activityList) => {
        if (activityList.length < 2) return;

        // Get total possible pairs
        const totalPossiblePairs = (activityList.length * (activityList.length - 1)) / 2;

        // If we've compared all possible pairs, finish
        if (comparedPairs.size >= totalPossiblePairs) {
            finishComparisons();
            return;
        }

        // Try to find a new pair that hasn't been compared yet
        let attempts = 0;
        const maxAttempts = 50; // Prevent infinite loop

        while (attempts < maxAttempts) {
            // Select two different random activities
            let idx1 = Math.floor(Math.random() * activityList.length);
            let idx2 = Math.floor(Math.random() * activityList.length);

            // Make sure they're different
            while (idx2 === idx1) {
                idx2 = Math.floor(Math.random() * activityList.length);
            }

            // Sort indices to create a consistent pair identifier
            const minIdx = Math.min(idx1, idx2);
            const maxIdx = Math.max(idx1, idx2);
            const pairKey = `${minIdx}-${maxIdx}`;

            // Check if this pair has been compared before
            if (!comparedPairs.has(pairKey)) {
                // New pair found, update state
                setComparedPairs(prev => new Set([...prev, pairKey]));
                setCurrentPair([activityList[idx1], activityList[idx2]]);
                return;
            }

            attempts++;
        }

        // If we couldn't find a new pair after many attempts, just finish
        finishComparisons();
    };

    // Updated: Handle user selection with ELO-style rating
    const handleActivitySelect = (selectedActivity) => {
        // Find the other activity in the pair
        const otherActivity = currentPair.find(activity => activity.text !== selectedActivity.text);

        if (!otherActivity) return;

        // Get current ratings
        const selectedRating = rankings[selectedActivity.text];
        const otherRating = rankings[otherActivity.text];

        // Calculate expected win probability using ELO formula
        const expectedWin = 1 / (1 + Math.pow(10, (otherRating - selectedRating) / 400));

        // K factor determines how much a single comparison affects ratings
        // Higher values mean bigger rating changes
        const kFactor = 32;

        // Calculate new ratings (selected activity "won" the comparison)
        const newSelectedRating = selectedRating + kFactor * (1 - expectedWin);
        const newOtherRating = otherRating + kFactor * (0 - (1 - expectedWin));

        // Update the rankings
        setRankings(prevRankings => ({
            ...prevRankings,
            [selectedActivity.text]: Math.round(newSelectedRating),
            [otherActivity.text]: Math.round(newOtherRating)
        }));

        // Increment comparison count
        const newCount = comparisonsCount + 1;
        setComparisonsCount(newCount);

        // Check if we've done enough comparisons
        if (newCount >= MAX_COMPARISONS) {
            finishComparisons();
        } else {
            // Select next pair for comparison
            selectRandomPair(allActivities);
        }
    };

    // Finish the comparison process and show results
    const finishComparisons = () => {
        setComparisonsDone(true);
    };

    // Show the results screen with sorted activities by ELO rating
    // Update the navigateToResults function to call the API
    const navigateToResults = async () => {
        // Sort activities by their ELO rating
        const sortedActivities = Object.entries(rankings)
            .sort((a, b) => b[1] - a[1]) // Sort by score descending
            .map(([text, score]) => ({
                text,
                location: activities[text],
                score,
                // Add relative strength indicator
                strength: getStrengthCategory(score)
            }));

        console.log('Ranked activities:', sortedActivities);

        // Get top activities for voting
        const topActivities = sortedActivities.slice(0, 5); // Consider top 5 for better consensus

        // Count activities by location to find the consensus
        const locationCounts = {};
        topActivities.forEach(activity => {
            locationCounts[activity.location] = (locationCounts[activity.location] || 0) + 1;
        });

        console.log('Location counts from top activities:', locationCounts);

        // Find the location(s) with the most votes
        let maxCount = 0;
        let topLocations = [];
        Object.entries(locationCounts).forEach(([loc, count]) => {
            if (count > maxCount) {
                maxCount = count;
                topLocations = [loc];
            } else if (count === maxCount) {
                topLocations.push(loc);
            }
        });

        // Determine the primary location:
        // If there's a clear winner, use that location
        // If there's a tie, use the location of the highest-rated activity
        let primaryLocation;
        if (topLocations.length === 1) {
            primaryLocation = topLocations[0];
        } else {
            // There's a tie, find the highest-rated activity among the tied locations
            primaryLocation = topActivities.find(activity =>
                topLocations.includes(activity.location)
            ).location;
        }

        console.log('Selected primary location:', primaryLocation);

        // Get all activities for the selected location
        const activitiesInPrimaryLocation = sortedActivities.filter(
            activity => activity.location === primaryLocation
        );

        // Extract just the activity text to send to the API
        const selectedActivities = activitiesInPrimaryLocation.map(activity => activity.text);

        try {
            // Show loading state
            setIsGeneratingItinerary(true);

            // Create the request data object
            const itineraryRequestData = {
                location: primaryLocation,
                activities: selectedActivities,
                startLocation: tripDetails.location || '',
                startDate: tripDetails.startDate || new Date().toISOString(),
                days: tripDetails.duration || 3,
                startLocationCoordinates: tripDetails.startLocationCoordinates || { latitude: null, longitude: null }
            };

            // Make the API call as POST
            const response = await fetch(`/claude/generateItinerary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(itineraryRequestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const itineraryData = await response.json();
            console.log('Generated itinerary:', itineraryData);

            // Navigate to results with both ranked activities and the generated itinerary
            navigate('/show-itinerary', {
                state: {
                    rankedActivities: sortedActivities,
                    tripDetails,
                    itinerary: itineraryData,
                    selectedLocation: primaryLocation
                }
            });
        } catch (error) {
            console.error('Error generating itinerary:', error);
        } finally {
            setIsGeneratingItinerary(false);
        }
    };

    // Helper function to categorize activity strength
    const getStrengthCategory = (score) => {
        if (score >= 1200) return 'excellent';
        if (score >= 1100) return 'great';
        if (score >= 1000) return 'good';
        if (score >= 900) return 'fair';
        return 'poor';
    };

    // Then update the results screen to show loading state when generating itinerary
    if (comparisonsDone) {
        return (
            <div className={styles.comparisonContainer}>
                <h2>Thanks for your input!</h2>
                <p className={styles.subtitle}>We've analyzed your preferences</p>

                {isGeneratingItinerary ? (
                    <div className={styles.loadingContainer}>
                        <p>Generating your personalized itinerary...</p>
                        <div className={styles.spinner}></div>
                    </div>
                ) : (
                    <button
                        className={styles.continueButton}
                        onClick={navigateToResults}
                    >
                        See Your Personalized Itinerary
                    </button>
                )}
            </div>
        );
    }

    // Show loading state if we don't have a pair yet
    if (!currentPair || currentPair.length !== 2) {
        return (
            <div className={styles.comparisonContainer}>
                <h2>Preparing your adventure options...</h2>
            </div>
        );
    }

    return (
        <div className={styles.comparisonContainer}>
            <h2>Which activity appeals to you more?</h2>
            <p className={styles.subtitle}>
                Comparison {comparisonsCount + 1} of {MAX_COMPARISONS}
            </p>

            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${(comparisonsCount / MAX_COMPARISONS) * 100}%` }}
                ></div>
            </div>

            <div className={styles.activitiesGrid}>
                <div
                    className={styles.activityTile}
                    onClick={() => handleActivitySelect(currentPair[0])}
                >
                    <div className={styles.activityImage}>
                        <div className={styles.activityIcon}>🏕️</div>
                    </div>
                    <h3>{currentPair[0].location}</h3>
                    <p>{currentPair[0].text}</p>
                </div>

                <div
                    className={styles.activityTile}
                    onClick={() => handleActivitySelect(currentPair[1])}
                >
                    <div className={styles.activityImage}>
                        <div className={styles.activityIcon}>🏄‍♂️</div>
                    </div>
                    <h3>{currentPair[1].location}</h3>
                    <p>{currentPair[1].text}</p>
                </div>
            </div>

            <p className={styles.skipText}>
                Click on the activity you prefer
            </p>
        </div>
    );
};

export default ActivityComparison;