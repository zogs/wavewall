<script>

  import { onMount } from 'svelte';
  import Loader from '../Loader.svelte';
  import SurfoDay from './day/SurfoDay.svelte';

  export let name;
  export let content;
  export let id;

  let container;
  let canvasSwell;
  let canvasTides;

  let data = {

  }

</script>


<div class="row" id={id} bind:this={container}>
  {#if content == null }<div class="loader"><Loader></Loader></div>{/if}
  <div class="spotname"><span>{ name }</span></div>
  <div class="days">
    {#each Array(7) as _,i }
    <SurfoDay data={data}></SurfoDay>
    {/each}
  </div>
</div>

<style>

  .row { flex:1; position:relative; }

  .spotname { color:white; position:absolute; top:50%; transform:translateY(-50%); width:100%; padding-right:50px; display: flex; justify-content:flex-end; align-items: center; z-index:10; pointer-events: none; }
  .spotname span { font-family:helvetica; font-family: 'Pacifico', cursive; font-size:46px; color:rgba(255,255,255,1); text-shadow:0 1px 0 #000, 0 2px 0 #000, 0 3px 0 #000, 0 4px 0 #000, 0 5px 0 #000, 2px 2px 15px rgba(0,0,0,0.8); letter-spacing:2px; }

  .days { width:100%; height:100%; display:flex; justify-content: space-between; }


</style>