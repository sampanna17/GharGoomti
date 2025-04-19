/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
	  extend: {
		keyframes: {
		  scroll: {
			'0%': {
			  transform: 'translateX(0)',
			},
			'100%': {
			  transform: 'translateX(-25%)',
			},
		  },
		},
		animation: {
		  'scroll': 'scroll 20s linear infinite',
		},
	  },
	},
	plugins: [],
  };