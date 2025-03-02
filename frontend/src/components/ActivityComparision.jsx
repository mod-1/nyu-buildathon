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
    const navigateToResults = () => {
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

        navigate('/activity-results', {
            state: {
                rankedActivities: sortedActivities,
                tripDetails
            }
        });
    };

    // Helper function to categorize activity strength
    const getStrengthCategory = (score) => {
        if (score >= 1200) return 'excellent';
        if (score >= 1100) return 'great';
        if (score >= 1000) return 'good';
        if (score >= 900) return 'fair';
        return 'poor';
    };

    // Show the results screen after comparisons are done
    if (comparisonsDone) {
        return (
            <div className={styles.comparisonContainer}>
                <h2>Thanks for your input!</h2>
                <p className={styles.subtitle}>We've analyzed your preferences</p>

                <button
                    className={styles.continueButton}
                    onClick={navigateToResults}
                >
                    See Your Personalized Itinerary
                </button>
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