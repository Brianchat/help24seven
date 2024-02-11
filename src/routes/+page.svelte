<script>
  import { onMount } from "svelte";
  import { Alert, Button } from 'flowbite-svelte';
  import { InfoCircleSolid, EyeSolid } from 'flowbite-svelte-icons';

  let errorMessage;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      errorMessage = "Geolocation is not supported by this browser.";
    }
  }

  function showPosition(position) {
    errorMessage =
      "Latitude: " +
      position.coords.latitude +
      ", Longitude: " +
      position.coords.longitude;
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = "An unknown error occurred.";
        break;
    }
  }

  onMount(() => {
    navigator.permissions &&
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (PermissionStatus) {
          if (PermissionStatus.state == "granted") {
            errorMessage = false;
          } else if (PermissionStatus.state == "prompt") {
            errorMessage =
              "Please enable location permissions so that we can respond quicker in an emergency.";
              getLocation();
          } else {
            getLocation();
          }
        });
  });
</script>
{#if errorMessage}
<Alert color="red" class="w-full shrink-0" border>
  <div class="flex items-center gap-3">
    <InfoCircleSolid slot="icon" class="w-4 h-4" />
    <span class="text-lg font-medium">GPS Location Unavailable</span>
  </div>
  <p class="mt-2 mb-4 text-sm">{errorMessage}</p>
</Alert>
{/if}
<Button href="/emergency" class="w-1/2">Emergency</Button>
