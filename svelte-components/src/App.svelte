<script>
	import ButtonAddSpot from './components/ButtonAddSpot.svelte'
	import ButtonNavPanel from './components/ButtonNavPanel.svelte'
	import ModalSpotsList from './components/ModalSpotsList.svelte';
	import ToolbarBottom from './components/ToolbarBottom.svelte';
	import SurfLoader from './components/SurfLoader.svelte';
  import Panel from './components/Panel.svelte';
  import {spots, page, nbPages, nbPerPage, nbSpots, modal, visualMode} from './stores/AppStore';
	import { onMount } from 'svelte';
  import ButtonMenu from './components/ButtonMenu.svelte';

  let _init = false;

	onMount(async () => {

		// get spots from storage
    let _spots = JSON.parse(window.localStorage.getItem('spots'));
    // temporary hardcoding spots list
    //let _spots = [{"name":"Les Blancs Sablons","url":"https://www.yadusurf.com/meteo-surf-report/Les-Blancs-Sablons/1183"},{"name":"Le Petit Minou","url":"https://www.yadusurf.com/meteo-surf-report/Le-Petit-Minou/1187"},{"name":"La Torche","url":"https://www.yadusurf.com/meteo-surf-report/La-Torche/1203"},{"name":"Penfoul","url":"https://www.yadusurf.com/meteo-surf-report/Penfoul/1181"},{"name":"Pourville-sur-Mer","url":"https://www.yadusurf.com/meteo-surf-report/Pourville-sur-Mer/1148"}]


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
  article { width:100%; height:100%; display:flex; align-items: center; justify-content: center; }
</style>