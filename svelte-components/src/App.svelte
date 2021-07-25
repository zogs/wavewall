<script>
	import ButtonAddSpot from './components/ButtonAddSpot.svelte'
	import ButtonNavPanel from './components/ButtonNavPanel.svelte'
	import ModalSpotsList from './components/ModalSpotsList.svelte';
	import ToolbarBottom from './components/ToolbarBottom.svelte';
  import Panel from './components/Panel.svelte';
  import {spots, page, nbPages, nbPerPage, nbSpots, modal, visualMode} from './stores/AppStore';
	import { onMount } from 'svelte';
  import ButtonMenu from './components/ButtonMenu.svelte';

  let _init = false;

  $: console.log($nbSpots, $page, $nbPages, $nbPerPage, $spots);

	onMount(async () => {
		// get spots from storage

    let _spots = JSON.parse(window.localStorage.getItem('spots'));

		if(!_spots) {
      $spots = []
			$modal = 'spots_list';
		} else {
      // fetch all spots content
      _spots = await fetchAllContents(_spots);
      $spots = _spots;
    }


    if(window.localStorage.getItem('visualMode')) {
        $visualMode = window.localStorage.getItem('visualMode');
    }

    _init = true;
	})

  async function fetchAllContents(_spots) {
    if(_spots) {
    console.log('fetchAllContents', spots);
      await Promise.all(_spots.map(async spot => {
          const res = await fetch('/fetch?url='+encodeURI(spot.url));
          const content = await res.text();
          spot.content = content;
        }));
      return _spots;
    }
  }

	async function closeList() {
		$modal = null;
		window.localStorage.setItem('spots', JSON.stringify($spots));
    $spots = await fetchAllContents($spots);
	}

</script>

{#if _init}
<main class:grayscale-mode={$visualMode == 'grayscale'}>
	<Panel />

  <ToolbarBottom>
    {#if $nbPages === 1}
  	<ButtonAddSpot></ButtonAddSpot>
    {:else}
    <ButtonNavPanel/>
    {/if}
  	<ButtonMenu></ButtonMenu>
  </ToolbarBottom>

  {#if $modal == 'spots_list'}
  <ModalSpotsList on:close={closeList}></ModalSpotsList>
  {/if}
</main>
{/if}

<style>
  :global(html) { height:100%;}
  :global(body) { height:100%;}
  main { height:100%; }
</style>