<script>


	import VisualModeButton from './components/VisualModeButton.svelte';
	import SpotsListButton from './components/SpotsListButton.svelte';
	import ModalSpotsList from './components/ModalSpotsList.svelte';
  import Panel from './components/Panel.svelte';
	import { onMount } from 'svelte';

	let visual_mode = 'color';
	let modal = null;
	let _spots = []
  let _init = false;

	onMount(async () => {
		// get spots from storage
		_spots = JSON.parse(window.localStorage.getItem('spots'));
    console.log(_spots)
		if(!_spots) {
      _spots = []
			modal = 'spots_list';
		}

    _init = true;
	})

	function openList() {
		modal = 'spots_list';
	}
	function closeList() {
		modal = null;
		window.localStorage.setItem('spots', JSON.stringify(_spots));
	}

</script>

{#if _init}
<main class:grayscale-mode={visual_mode == 'grayscale'}>
	<Panel _spots={_spots} />

  <div class="toolbar">
  	<SpotsListButton on:open-list={openList}></SpotsListButton>
  	<VisualModeButton bind:mode={visual_mode}></VisualModeButton>
  </div>

  {#if modal == 'spots_list'}
  <ModalSpotsList bind:spots={_spots} on:close={closeList}></ModalSpotsList>
  {/if}
</main>
{/if}

<style>
  :global(html) { height:100%;}
  :global(body) { height:100%;}
  main { height:100%; }
</style>