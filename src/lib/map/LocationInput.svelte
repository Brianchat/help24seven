<script>
    import { onMount } from 'svelte';
    import { PUBLIC_GOOGLE_MAPS_KEY } from '$env/static/public';

    // Bindings
    let domElement;

    export let label="Location";
    export let location;


    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    onMount(async function () {
        // const { Autocomplete } = await loader.importLibrary('places');
        const { Map, AdvancedMarkerElement, Autocomplete, encoding } = await import('./index.mjs')
        const options = {
            componentRestrictions: { country: 'zw' },
            strictBounds: false
        };

        let autocomplete = new Autocomplete(
            domElement,
            options
        );

        autocomplete.addListener("place_changed", ()=>{ 
            location = autocomplete.getPlace();
        });
    });
</script>

<label>{label}
  <input bind:this={domElement} type="text" />
</label>
