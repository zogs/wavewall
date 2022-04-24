import App from './App.svelte';

const container = document.querySelector('#svelte-container');
if(container) {
  const app = new App({
    target: container,
    props: {
      name: 'surfwall'
    }
  });
}

export default app;