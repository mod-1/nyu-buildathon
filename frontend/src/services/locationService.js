const getCurrentLocationFromAPI = async (position) => {
    try {
        const { latitude, longitude } = position.coords
        const response = await fetch(
            `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()

        let formattedLocation = ''

        if (data && data.localityInfo) {
            // Format the location based on available data
            const city = data.city || ''
            // const countryName = data.countryName || ''

            formattedLocation = city
        }

        // If no formatted location was created, use coordinates as string
        if (!formattedLocation) {
            formattedLocation = `${latitude}, ${longitude}`
        }

        // Return both formatted location and coordinates
        return {
            formattedLocation,
            coordinates: {
                latitude,
                longitude
            }
        }

    } catch (error) {
        console.error("Error fetching location:", error)
        return {
            formattedLocation: `${position.coords.latitude}, ${position.coords.longitude}`,
            coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        }
    }
}

export { getCurrentLocationFromAPI }