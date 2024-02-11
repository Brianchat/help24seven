<script>
    import { goto } from "$app/navigation";
    import { env } from "$env/dynamic/public";
    import { onMount } from "svelte";
    import { Button } from 'flowbite-svelte';

    let logout=()=>{
        setTimeout( logout, 1000 );
    };
    
    onMount(async ()=>{
        const { Hanko } = await import("@teamhanko/hanko-elements");

        const hankoApi = env.PUBLIC_HANKO_API_URL;
  
        const hanko = new Hanko(hankoApi);
        logout = () => {
            hanko.user.logout().catch((error) => {
                // handle error
            });
            goto("/login");
        };
    })
  </script>
  
  <Button on:click={logout}>Logout</Button>