/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  
	plugins: [require('flowbite/plugin')],
  
	darkMode: 'class',
  
	theme: {
	  extend: {
		colors: {
		  // flowbite-svelte
		  primary: {
			50: '#fff2ff',
			100: '#fee5ff',
			200: '#fecaff',
			300: '#ffa0fe',
			400: '#ff67fc',
			500: '#fd2eff',
			600: '#e70eeb',
			700: '#bc07bc',
			800: '#a0089f',
			900: '#820d7f',
			950: '#580055',
		  },
		  gray: {
			50: '#fafafa',
			100: '#f4f4f5',
			200: '#e4e4e7',
			300: '#d4d4d8',
			400: '#a1a1aa',
			500: '#71717a',
			600: '#52525b',
			700: '#3f3f46',
			800: '#27272a',
			900: '#18181b',
			950: '#09090b',
		  }
		}
	  }
	}
  };
  
  module.exports = config;
  