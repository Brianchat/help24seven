<script>
    import { onMount } from 'svelte';
    import { Button } from 'flowbite-svelte';
    import LocationInput from './LocationInput.svelte';
	

    // Bindings
    let Map, AdvancedMarkerElement, Autocomplete, encoding, fetchRoute;
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

    async function success(pos) {
        const crd = pos.coords;
        position = {lat: crd.latitude, lng: crd.longitude}

        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        // const { Map } = await loader.importLibrary('maps');

        

        // const { AdvancedMarkerElement } = await loader.importLibrary("marker");
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

        // const { encoding } = await loader.importLibrary("geometry");
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
  
    

    onMount(async function () {
        // const { Autocomplete } = await loader.importLibrary('places');
        ({ Map, AdvancedMarkerElement, Autocomplete, encoding, fetchRoute } = await import('./index.mjs'));

        map = new Map(mapElement, {
            // center: { lat: -34.397, lng: 150.644 },
            // center: {lat: -17.83, lng: 31.090595},
            center: position,
            zoom: parseInt(zoom),
            mapId: "e9d9d5fcbbcfc6f9"
        });

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
</script>

<LocationInput label="Origin:" bind:location={origin}/>
<LocationInput label="Destination:" bind:location={destination}/>

<Button on:click={async ()=>routes= await fetchRoute(origin, destination)}>Fetch</Button>

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

<pre>
    {JSON.stringify(routes, null, 2)}
</pre>

<style>
    div {
        height: 100%;
        min-height: 400px;
        width: 100%;
    }
</style>