
import axios from 'axios';

// The API key would be provided by the user
// For security, in a production app, you would use a backend proxy
const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY_HERE"; 

export interface PlaceSuggestion {
  description: string;
  place_id: string;
}

export interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  }
}

// Get place suggestions based on input text
export const getPlaceSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
  if (!input || input.length < 3) return [];
  
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}`
    );
    
    // Due to CORS restrictions, this direct API call may not work in frontend code
    // In a production app, you would use a backend proxy or Google Maps JavaScript API
    return response.data.predictions.map((prediction: any) => ({
      description: prediction.description,
      place_id: prediction.place_id
    }));
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return [];
  }
};

// Get place details (address, coordinates) from a place_id
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${GOOGLE_API_KEY}`
    );
    
    // Due to CORS restrictions, this direct API call may not work in frontend code
    // In a production app, you would use a backend proxy or Google Maps JavaScript API
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

// Get address from coordinates using reverse geocoding
export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );
    
    // Due to CORS restrictions, this direct API call may not work in frontend code
    // In a production app, you would use a backend proxy
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    }
    return `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};
