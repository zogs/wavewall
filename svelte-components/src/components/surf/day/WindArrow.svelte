<script>

   import { onMount } from 'svelte';

   let data = {}
   let scale = 1;

   $: scale = 1 + data.force/10;

   onMount(async () => {

     data.direction = Math.ceil(Math.random()*360);
     data.force = Math.ceil(Math.random()*5);
   })

</script>

<div class="arrow">
  <img class="force-{data.force}" src="/img/wind_arrow.png" alt="" style="transform: rotate({data.direction}deg) scale({scale});" />
  <span>{data.force}</span>
</div>

<style>
  div { position: relative; }
  img { width:20px; height:20px; }
  img.force-1 { filter: hue-rotate(10deg) saturate(200%) grayscale(100%) }
  img.force-2 { filter: hue-rotate(20deg) saturate(200%) grayscale(100%) }
  img.force-3 { filter: hue-rotate(26deg) saturate(200%) grayscale(100%) }
  img.force-4 { filter: hue-rotate(55deg) saturate(300%) grayscale(100%) }
  img.force-5 { filter: hue-rotate(200deg) saturate(500%) grayscale(100%) }
  span { position:absolute; font-size:10px; top:2px; left:50%; transform: translateX(-50%); }
</style>