<script>

	import Surfometer from './components/SurfometerYaDuSurf.svelte';
	import VisualModeButton from './components/VisualModeButton.svelte';
	import SpotsListButton from './components/SpotsListButton.svelte';
	import ModalSpotsList from './components/ModalSpotsList.svelte';
  import Panel from './components/Panel.svelte';
	import { onMount } from 'svelte';

	let visual_mode = 'color';
	let modal = null;
	let reload = 0;

	let spots = []

	onMount(async () => {
		// get spots from storage
		spots = JSON.parse(window.localStorage.getItem('spots'));
    console.log(spots)
		if(!spots) {
      spots = []
			modal = 'spots_list';
		}
	})

	function openList() {
		modal = 'spots_list';
	}
	function closeList() {
		modal = null;
		reload++;
		window.localStorage.setItem('spots', JSON.stringify(spots));
	}

</script>

<main class:grayscale-mode={visual_mode == 'grayscale'}>
	<Panel>
		{#each spots as spot }
			<Surfometer name={spot.name} url={spot.url} reload={reload}></Surfometer>
		{/each}
  </Panel>

  <div class="toolbar">
  	<SpotsListButton on:open-list={openList}></SpotsListButton>
  	<VisualModeButton bind:mode={visual_mode}></VisualModeButton>
  </div>

  {#if modal == 'spots_list'}
  <ModalSpotsList bind:spots={spots} on:close={closeList}></ModalSpotsList>
  {/if}
</main>

<style>
  :global(html) { height:100%;}
  :global(body) { height:100%;}
  main { height:100%; }
</style>