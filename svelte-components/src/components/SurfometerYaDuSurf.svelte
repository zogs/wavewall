<script>

  import { onMount } from 'svelte';
import { dataset_dev } from 'svelte/internal';
  import Loader from './Loader.svelte';

  export let name;
  export let url;
  export let reload;

  let content = null;
  let canvas = null;
  let surfometer = null;

  // on mount, fetch the image
  onMount(async() => {
    fetchImage();
  });

  // on reload request, re-fetch the image
  $: {
    fetchImage(reload);
  }

  async function fetchImage() {
    content = null;
    const res = await fetch('/fetch?url='+encodeURI(url));
    const html = await res.text();
    content = html;
    //setTimeout(() => drawTide(), 100);
  }

  function drawTide() {

    var tides = surfometer.getElementsByClassName('SurfometerV3')[0].dataset.tides;
    tides = JSON.parse(tides);

    tides.map((t, i) => {
      t.BM1 = getPercentFromBegining(t.BM1, i);
      t.BM2 = getPercentFromBegining(t.BM2, i);
      t.HM1 = getPercentFromBegining(t.HM1, i);
      t.HM2 = getPercentFromBegining(t.HM2, i);
    })
    console.log(tides);

    let points = [];
    tides.map(t => {
      points.push({x: t.BM1, y: parseInt(t.Coef)})
      points.push({x: t.HM1, y: -parseInt(t.Coef)})
      points.push({x: t.BM2, y: parseInt(t.Coef)})
      points.push({x: t.HM2, y: -parseInt(t.Coef)})
    })

    var ctx = canvas.getContext("2d");
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(255,255,255)";

    points.filter(p => p.x != 0).map(p => {
      let x = p.x * width / 100;
      let y = 50 + p.y/2.4;
      console.log(x,y);

      ctx.lineTo(x,y);
    })
    ctx.stroke();
  }

  const getMinuteFromBegining = function(horaire, day) {
    if(horaire == '-') return 0;
    let [hours, minutes] = horaire.replace(' ','').split('h');

    return parseInt(day * 1440 + parseInt(hours) * 60 + parseInt(minutes));
  }

  const getPercentFromBegining = function(horaire, day) {
    let total = 7 * 24 * 60;
    return getMinuteFromBegining(horaire, day) / total * 100;
  }

</script>

<div class="surfometer" bind:this={surfometer}>
  {#if content == null }<div class="loader"><Loader></Loader></div>{/if}
  <div class="spotname">{ name }</div>
  <!-- <div class="tide"><canvas bind:this={canvas} width=1000 height=100></canvas></div>-->
  <div class="container">
    {@html content }
  </div>
</div>

<style>

</style>