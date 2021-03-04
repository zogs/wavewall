<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();



    export let spots;


    let selectorOpened = false
    let spots_availables = []
    let spots_searched = []
    let search = ''
    loadSpotsList();

    $: {
      let searched = [];
      spots_availables.map(region => { searched.push({ region: region.region, spots: region.spots.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))})});
      spots_searched = searched;
    }

    $: {
      search = '';
      console.log(selectorOpened)
    }

    function up(spot) {
      let index = spots.indexOf(spot);
      spots.splice(index,1)
      spots.splice(index-1, 0, spot)
      spots = spots;
    }

    function down(spot) {
      let index = spots.indexOf(spot);
      spots.splice(index,1)
      spots.splice(index+1, 0, spot)
      spots = spots;
    }

    function remove(spot) {
      let index = spots.indexOf(spot);
      spots.splice(index,1);
      spots = spots;
    }

    function add(spot) {
      spots.push({
        name: spot.name,
        url: buildUrl(spot)
      })
      spots = spots;
      selectorOpened = false;
    }

    function buildUrl(spot) {
      return `https://www.yadusurf.com/meteo-surf-report/${spot.nameforurl}/${spot.fid}`;
    }

    function close() {
      dispatch('close');
    }

    function openSelector() {
      selectorOpened = true;
    }

    async function loadSpotsList() {
      let res = await fetch('/spots');
      let json = await res.json();
      spots_availables = json;
    }


</script>

<div class="modal modal-spots-list">
  <div class="modal-inner">
    <ul>
      {#each spots as spot}
      <li>
        {spot.name}
        <span class="actions">
          <span class="up" on:click={up(spot)}>▲</span>
          <span class="down" on:click={down(spot)}>▼</span>
          <span class="remove" on:click={remove(spot)}>✖</span>
        </span>
      </li>
      {/each}
    </ul>
    <div class="modal-bottom-buttons">
      <button on:click="{openSelector}">Ajouter un spot</button>
      <button on:click="{close}">Fermer</button>
    </div>
  </div>
</div>

{#if selectorOpened && spots_availables }
<div class="modal modal-spots-availables">
  <div class="modal-inner">
    <h1>Choisir un spot</h1>
    <input type="text" name="search" bind:value={search} placeholder="Rechercher un spot" autocomplete="off">
    <div class="list">
    {#each spots_searched as region}
    {#if region.spots.length > 0 }
    <strong>{ region.region }</strong>
    <ul>
      {#each region.spots as spot}
      <li on:click={add(spot)}>{spot.name}</li>
      {/each}
    </ul>
    {/if}
    {/each}
    </div>
    <div class="modal-bottom-buttons">
      <button on:click="{close}">Fermer</button>
    </div>
  </div>
</div>
{/if}
