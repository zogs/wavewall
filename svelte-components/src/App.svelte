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
  let _now = new Date();

	onMount(async () => {

		// get spots from storage
    let _spots = JSON.parse(window.localStorage.getItem('spots'));

    // temporary hardcoding spots list
    _spots = [{
            "name": "Anse de Pen-Hat",
            "url": "https://www.yadusurf.com/meteo-surf-report/Anse-de-Pen-Hat/1188",
        },{
            "name": "Baie des Trépassés",
            "url": "https://www.yadusurf.com/meteo-surf-report/Baie-des-Trepasses/1197",
        },{
            "name": "Douarnenez ",
            "url": "https://www.yadusurf.com/meteo-surf-report/Douarnenez/1195",
        },{
            "name": "Les Blancs Sablons",
            "url": "https://www.yadusurf.com/meteo-surf-report/Les-Blancs-Sablons/1183",
        },{
            "name": "Penfoul",
            "url": "https://www.yadusurf.com/meteo-surf-report/Penfoul/1181",
        }
    ];


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
    <div class="date">généré le:<br> { _now.toLocaleDateString('fr', { weekday: 'short', year: undefined, month: 'long', day: 'numeric' }) }<br>à { _now.toLocaleTimeString('fr', {hour: '2-digit', minute:'2-digit'}) }</div>
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
  div.date { position:absolute; left:12px; background:#000; color: white; padding: 10px 20px; border-radius:10px; font-size:12px; }
</style>