<script>
  import { onMount } from "svelte";
  import Surfometer from './SurfometerYaDuSurf.svelte';

  export let _spots;

  let _days = [];
  let _surfometerHeight = 0;


  onMount(() => {

    _days.push("Aujourd'hui");
    _days.push("Demain");
    let today = new Date();
    for (let i = 2; i < 7; i++) {
      let date = addDays(today, i);
      let label = date.toLocaleDateString(undefined, {weekday: 'long'})
      _days.push(label);
    }
    _days = _days;


    calcSurfometerHeightToScreen();
  });

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function calcSurfometerHeightToScreen() {
    let totalHeight = window.innerHeight;
    let nbSurfometer = _spots.length;
    let correctedHeight = totalHeight - document.getElementById('dates').offsetHeight - (nbSurfometer*10);
    let individualHeight = correctedHeight / nbSurfometer;
    _surfometerHeight = Math.floor(individualHeight);
  }

  function fitHeight(ev) {
    document.querySelectorAll('.surfometer img').forEach(el => el.style.height = _surfometerHeight+'px');
  }

  function handleResize() {
    calcSurfometerHeightToScreen();
    fitHeight();
  }

</script>

<svelte:window on:resize={handleResize}/>

<div class="panel">
  <header class="dates" id="dates">
    {#each _days as label}
    <div>{ label }</div>
    {/each}
  </header>
  {#if _spots.length > 0}
  {#each _spots as spot,i }
			<Surfometer name={spot.name} id={'spot-'+i} url={spot.url} on:loaded={fitHeight}></Surfometer>
	{/each}
  {/if}
</div>

<style>
  .panel { display:flex; height:100%; flex-wrap:nowrap; flex-direction:column; justify-content:flex-start; }
  header.dates { display: flex; color:#fff; height: 20px; max-height:20px; min-height:20px; width:100%; flex-direction:row; justify-content: flex-start; align-items: center; flex:1; }
  header.dates div { width:100%; text-align:center; font-size: 10px; text-transform:uppercase; }
</style>