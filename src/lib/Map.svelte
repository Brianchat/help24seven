<script>
    import { onMount } from 'svelte';
    import { PUBLIC_GOOGLE_MAPS_KEY } from '$env/static/public';
    import { Loader } from '@googlemaps/js-api-loader';
    import { Button } from 'flowbite-svelte';
	

    // Bindings
    let mapElement, originElement, originAutocomplete, destinationElement, destinationAutocomplete;
    let position={lat: -17.83, lng: 31.090595};
    export let zoom=19;
    let map, origin, destination, setPath;
    let routes=[];
    let currentRoute=0;
    let path='';
    let decodedPath='';

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const loader = new Loader({
        apiKey: PUBLIC_GOOGLE_MAPS_KEY,
        version: 'weekly',
    });

    async function success(pos) {
        const crd = pos.coords;
        position = {lat: crd.latitude, lng: crd.longitude}

        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        const { Map } = await loader.importLibrary('maps');

        map = new Map(mapElement, {
            // center: { lat: -34.397, lng: 150.644 },
            // center: {lat: -17.83, lng: 31.090595},
            center: position,
            zoom: parseInt(zoom),
            mapId: "e9d9d5fcbbcfc6f9"
        });

        const { AdvancedMarkerElement } = await loader.importLibrary("marker");
        const marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            gmpDraggable: true,
            title: 'Your Location'
        });

        marker.addListener("dragend", (event) => {
            position = marker.position;
            console.log( `Pin dropped at: ${position.lat}, ${position.lng}`);
        });

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    async function loadPath(id) {
        // remove current path if one is already set.
        if(setPath) setPath.setMap(null);
        
        path=routes[id].polyline.encodedPolyline;

        const { encoding } = await loader.importLibrary("geometry");
        decodedPath = encoding.decodePath(path);
        let bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < decodedPath.length; i++) {
            bounds.extend(decodedPath[i]);  
        }
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds)

        setPath = new google.maps.Polyline({
            path: decodedPath,
            strokeColor: "#bc07bc",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });
        setPath.setMap(map);
        currentRoute=id;
    }
  
    async function fetchRoute() {
        if(setPath) setPath.setMap(null);
        try {
            const response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
                method: 'POST',
                headers: { 
                    "Content-Type": 'application/json',
                    "X-Goog-Api-Key": "AIzaSyDLIGING8NrN3grLslvv_R3LJLhGeYBjLU",
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
                routes=data.routes;
                loadPath(0);
            } else {
                routes=[]
            }
        } catch (e) {
            routes=[]
        }
    }

    onMount(async function () {
        const { Autocomplete } = await loader.importLibrary('places');
        const options = {
            componentRestrictions: { country: 'zw' },
            strictBounds: false
        };

        originAutocomplete = new Autocomplete(
            originElement,
            options
        );

        originAutocomplete.addListener("place_changed", ()=>{ 
            origin = originAutocomplete.getPlace();
            if( origin && destination ) fetchRoute(); 
        });
        
        destinationAutocomplete = new Autocomplete(
            destinationElement,
            options
        );

        destinationAutocomplete.addListener("place_changed", ()=>{ 
            destination = destinationAutocomplete.getPlace();
            if( origin && destination ) fetchRoute();  
        });

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
</script>

<label for="origin">origin:</label>
<input bind:this={originElement} name="origin" type="text" />

<label for="destination">Destination:</label>
<input bind:this={destinationElement} name="destination" type="text" />

<Button on:click={fetchRoute}>Fetch</Button>

{#if origin && destination}
    <h1>{origin?.formatted_address} to {destination?.formatted_address}</h1>
    {#each routes as route, i }
        <Button on:click={ ()=>loadPath(i) } outline={ currentRoute!==i }>
            <pre>
                Distance: { Math.ceil(route.distanceMeters/100)/10}km
                Cost: ${ Math.ceil(Math.ceil(route.distanceMeters/1000) * 1.15)}
                Estimated trip time: {new Date( parseInt(route.duration) * 1000).toISOString().substring(14, 19)}s
            </pre>
        </Button>
    {/each}
{/if}

<div bind:this={mapElement}  />


<style>
    div {
        height: 100%;
        min-height: 400px;
        width: 100%;
    }
</style>