import App from './App.svelte';

const app = new App({
	target: document.querySelector('#svelte-container'),
	props: {
		name: 'surfwall'
	}
});

export default app;