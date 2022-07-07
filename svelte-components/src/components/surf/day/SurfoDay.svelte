<script>

  import { onMount } from 'svelte';

  import SwellCanvas from './SwellCanvas.svelte';
  import SkyCanvas from './SkyCanvas.svelte';
  import TideCanvas from './TideCanvas.svelte';
  import WindArrow from './WindArrow.svelte';

  let _tmin;
  let _tmax;

  onMount(() => {

    _tmin = Math.ceil(10 + Math.random()*5)
    _tmax = Math.ceil(15 + Math.random()*10)

  });

</script>

<div class="day">

  <div class="wind">
    {#each [1,2,3,4,5] as i }
    <WindArrow />
    {/each}
  </div>
  <div class="scene">
    <div class="sky">
      <SkyCanvas />
    </div>
    <div class="swell">
      <SwellCanvas />
    </div>
    <div class="temps">
      <span class="max">{ _tmax }°</span>
      <span class="min">{ _tmin }°</span>
    </div>
  </div>
  <div class="tides">
    <TideCanvas />
  </div>
</div>

<style>
  .day { width:100%; height:100%; display:flex; flex-direction:column; border:1px solid grey; background:#fff; }

  .wind { height: 15%; border:1px solid #ddd; display:flex; justify-content: space-around; align-items: center; background-color: #f5f5f5; }
  .scene { height: 70%; border:1px solid #ddd; position:relative; }
  .tides { height: 15%; border:1px solid #ddd; }

  .swell { position:absolute; top:0; left:0; right:0; bottom:0; }
  .sky { position:absolute; top:0; left:0; right:0; bottom:0; }
  .temps { position:absolute; top: 0; left: 5px; display:flex; flex-direction: column; }
  .temps .min { display:block; margin:2px 0; font-size:11px; padding:2px; border-radius: 100%; background:#e7e7e7; border:1px solid #000; opacity:0.7; }
  .temps .max { display:block; margin:2px 0; font-size:10px; padding:2px; border-radius: 100%; background:#fff; border:1px solid #000; opacity:0.7; }
</style>