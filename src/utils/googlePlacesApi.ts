
// The API key would be provided by the user
const GOOGLE_API_KEY = "AIzaSyCSak5D8Z_NbVeimYQ2nb2U-ixUhvPN-Ec"; 

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

// This function loads the Places API script
export const loadGooglePlacesAPI = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set up callbacks
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Places API'));
    
    // Append script to document
    document.head.appendChild(script);
  });
};

// Get place suggestions based on input text
export const getPlaceSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
  if (!input || input.length < 3) return [];
  
  try {
    await loadGooglePlacesAPI();
    
    return new Promise<PlaceSuggestion[]>((resolve) => {
      const autocompleteService = new google.maps.places.AutocompleteService();
      
      autocompleteService.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            resolve([]);
            return;
          }
          
          const suggestions: PlaceSuggestion[] = predictions.map(prediction => ({
            description: prediction.description,
            place_id: prediction.place_id
          }));
          
          resolve(suggestions);
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return [];
  }
};

// Get place details (address, coordinates) from a place_id
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  try {
    await loadGooglePlacesAPI();
    
    return new Promise<PlaceDetails | null>((resolve) => {
      const map = document.createElement('div');
      const placesService = new google.maps.places.PlacesService(map);
      
      placesService.getDetails(
        { placeId, fields: ['formatted_address', 'geometry'] },
        (place, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
            resolve(null);
            return;
          }
          
          resolve({
            formatted_address: place.formatted_address || '',
            geometry: {
              location: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

// Get address from coordinates using reverse geocoding
export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
  try {
    await loadGooglePlacesAPI();
    
    return new Promise<string>((resolve) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };
      
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(`Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      });
    });
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return `Location at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

// Need to extend the Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}
