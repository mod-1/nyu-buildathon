const getCurrentLocationFromAPI = async (position) => {
    try {
        const { latitude, longitude } = position.coords
        const response = await fetch(
            `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()

        if (data && data.localityInfo) {
            // Format the location based on available data
            const city = data.city || ''
            const countryName = data.countryName || ''

            let formattedLocation = [city, countryName]
                .filter(Boolean)  // Remove empty values
                .join(', ')

            return formattedLocation || `${latitude}, ${longitude}`
        } else {
            return `${latitude}; ${longitude}`
        }
    } catch (error) {
        console.error("Error fetching location:", error)
        return `${position.coords.latitude}, ${position.coords.longitude}`
    }
}

export { getCurrentLocationFromAPI }