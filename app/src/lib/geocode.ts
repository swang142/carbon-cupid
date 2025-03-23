/**
 * Geocodes a location string to latitude and longitude coordinates.
 * Uses the Nominatim OpenStreetMap API.
 *
 * @param locationString - A string like "New York, USA" or "Berlin, Germany"
 * @returns A Promise that resolves to {latitude, longitude} or null if not found
 */
export async function geocodeLocation(
	locationString: string
): Promise<{ latitude: number; longitude: number } | null> {
	try {
		if (!locationString.trim()) return null;

		// Using OpenStreetMap's Nominatim API
		const response = await fetch(
			`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
				locationString
			)}`,
			{
				headers: {
					"User-Agent": "CarbonCupid/1.0", // Nominatim requires a User-Agent
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Geocoding failed: ${response.statusText}`);
		}

		const data = await response.json();

		if (data && data.length > 0) {
			const result = data[0];
			return {
				latitude: parseFloat(result.lat),
				longitude: parseFloat(result.lon),
			};
		}

		return null;
	} catch (error) {
		console.error("Geocoding error:", error);
		return null;
	}
}
