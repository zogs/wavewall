import App from './App.svelte';

const app = new App({
	target: document.querySelector('body'),
	props: {
		name: 'surfwall'
	}
});

export default app;