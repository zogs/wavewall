<script>
  import { onMount } from "svelte";
  import SurfoWeek from './surf/SurfoWeek.svelte';
  import SurfometerYaDuSurf from './surf/SurfometerYaDuSurf.svelte';
  import { spots, page, nbPages, nbPerPage, nbSpots } from '../stores/AppStore';

  let _init = false;
  let _days = [];
  let _surfometerHeight = 0;
  let _spotsDisplayed = [];

  $: {
    handleResize($nbSpots, $page)
  }

  $: {
    filterSpotsDisplayed($page, $spots);
  }

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


    _init = true;
    setTimeout(handleResize, 10);

  });

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function fitHeight() {
    let totalHeight = window.innerHeight;
    let nbSurfometer = $nbPerPage;
    let correctedHeight = totalHeight - document.getElementById('dates').offsetHeight - (nbSurfometer*10);
    let individualHeight = Math.floor(correctedHeight / nbSurfometer);
    document.querySelectorAll('.surfometer img').forEach(el => el.style.height = individualHeight+'px');
  }

  function handleResize() {
    if(_init === false) return;
    setTimeout(fitHeight, 10);
  }

  function filterSpotsDisplayed() {
    _spotsDisplayed = $spots.slice(($page-1) * $nbPerPage, ($page * $nbPerPage));
    console.log(_spotsDisplayed);
  }

</script>

<svelte:window on:resize={handleResize}/>

<div class="panel">
  <header class="dates" id="dates">
    {#each _days as label}
    <div>{ label }</div>
    {/each}
  </header>
  {#if $spots.length > 0}
  {#each _spotsDisplayed as spot,i }
    {#if spot.v2 === true }
      <SurfoWeek name={spot.name} id={'spot-'+i} url={spot.url} content={spot.content}></SurfoWeek>
    {:else}
			<SurfometerYaDuSurf name={spot.name} id={'spot-'+i} url={spot.url} content={spot.content}></SurfometerYaDuSurf>
    {/if}
	{/each}
  {/if}
</div>

<style>
  .panel { display:flex; height:100%; flex-wrap:nowrap; flex-direction:column; justify-content:flex-start; }
  header.dates { display: flex; color:#fff; height: 20px; max-height:20px; min-height:20px; width:100%; flex-direction:row; justify-content: flex-start; align-items: center; flex:1; }
  header.dates div { width:100%; text-align:center; font-size: 10px; text-transform:uppercase; }
</style>