import { Loader } from '@googlemaps/js-api-loader';
import { PUBLIC_GOOGLE_MAPS_KEY } from '$env/static/public';

const loader = new Loader({
    apiKey: PUBLIC_GOOGLE_MAPS_KEY,
    version: 'weekly',
});

const { Map } = await loader.importLibrary('maps');
const { AdvancedMarkerElement } = await loader.importLibrary("marker");
const { Autocomplete } = await loader.importLibrary('places');
const { encoding } = await loader.importLibrary("geometry");

async function fetchRoute(origin, destination) {
    try {
        const response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
            method: 'POST',
            headers: { 
                "Content-Type": 'application/json',
                "X-Goog-Api-Key": PUBLIC_GOOGLE_MAPS_KEY,
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
                "origin": { "placeId": origin.place_id },
                "destination":{ "placeId": destination.place_id },
                "travelMode": "DRIVE",
                "routingPreference": "TRAFFIC_AWARE",
                "departureTime": "2024-10-15T15:01:23.045123456Z",
                "computeAlternativeRoutes": true,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.routes)
            return data.routes;
        } else {
            return [];
        }
    } catch (e) {
        return [];
    }
}

export { Map, AdvancedMarkerElement, Autocomplete, encoding, fetchRoute }