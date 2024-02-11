<script>
	import "../app.pcss";
	import { onMount } from "svelte";
    import { goto } from '$app/navigation';
	import { Button, DarkMode, Navbar, NavBrand, NavLi, NavUl, NavHamburger, ImagePlaceholder, Skeleton, TextPlaceholder, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, Spinner } from 'flowbite-svelte';
	import Logo from "./logo.svelte";
	import LogoutButton from "$lib/LogoutButton.svelte";

    export let data, activeUrl;

    const logout = async () => {
		const url = `/api/auth/logout`;
		const response = await fetch(url, {
			method: 'POST',
			credentials: 'include'
		});
		if (response.ok) {
			goto('/', {
				invalidateAll: true
			});
		}
	};
</script>

<header class="" >
	<Navbar  fluid={true} class="m-0" style="background-color: #92278f;">
	  <NavBrand href="/">
		<Logo class="me-3 h-9 sm:h-12 " />
	  </NavBrand>
	  {#if data?.auth?.user}
	  <div class="items-center md:order-2">
		<!-- <Avatar id="avatar-menu" >{@html avatar}</Avatar> -->
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
	  </div>
	  <Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
		  <span class="block text-sm">Bonnie Green</span>
		  <span class="block truncate text-sm font-medium">name@flowbite.com</span>
		</DropdownHeader>
		<DarkMode class="w-full" />
		<DropdownItem>Settings</DropdownItem>
		<DropdownItem>Earnings</DropdownItem>
		<DropdownDivider />
		<DropdownItem href="/logout">Sign out</DropdownItem>
	  </Dropdown>
	  <NavUl {activeUrl} >
		<NavLi href="/maps" active={true}>Maps</NavLi>
		<NavLi href="/call">Calls</NavLi>
		<NavLi href="/private">Private</NavLi>
	  </NavUl>
	  <div>
		<LogoutButton />
	  </div>
	  {:else}
	  <div>
		<Button href="/login" size="sm">Login</Button>
	  </div>
	  {/if}
	</Navbar>
</header>

<main class="container mx-auto flex flex-col p-4 gap-3 items-center ">
	<slot></slot>
</main>

<style>

</style>

