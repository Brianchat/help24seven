<script>
    import { onMount } from 'svelte';
    import { PUBLIC_GOOGLE_MAPS_KEY } from '$env/static/public';
    import { Loader } from '@googlemaps/js-api-loader';

    // Bindings
    let mapElement;
    export let zoom=19;

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };


    async function success(pos) {
        const crd = pos.coords;
        const position = {lat: crd.latitude, lng: crd.longitude}

        console.log("Your current position is:");
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAPS_KEY,
            version: 'weekly',

        });

        const { Map } = await loader.importLibrary('maps');

        let map = new Map(mapElement, {
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
            title: 'Your Location'
        });

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    onMount(async function () {
        

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
</script>

<div bind:this={mapElement}  />

<style>
    div {
        height: 100%;
        min-height: 400px;
        width: 100%;
    }
</style>