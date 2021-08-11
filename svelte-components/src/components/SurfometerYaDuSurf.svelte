<script>

  import { onMount } from 'svelte';
  import Loader from './Loader.svelte';

  export let name;
  export let url;
  export let content;
  export let id;

  let canvas = null;
  let surfometer = null;

  // on mount, fetch the image
  onMount(async() => {
  });

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

<div class="surfometer" id={id} bind:this={surfometer}>
  {#if content == null }<div class="loader"><Loader></Loader></div>{/if}
  <div class="spotname"><span>{ name }</span></div>
  <!-- <div class="tide"><canvas bind:this={canvas} width=1000 height=100></canvas></div>-->
  {@html content }
</div>

<style global>

  .surfometer { position:relative; width:50%;  margin-bottom:5px; /* flex: 1; */}
  .spotname { color:white; position:absolute; width:100%; height:100%; padding: 10px; display: flex; justify-content:flex-end; align-items: center; z-index:10; pointer-events: none; }
  .spotname span { font-family:helvetica; font-family: 'Ranchers', cursive; font-size:36px; color:rgba(255,255,255,1); text-shadow:2px 2px 5px rgba(0,0,0,0.8); letter-spacing:2px; }

  .loader { position:absolute; top:40%; left:50%; }
  :global(.SurfometerV3) { display:flex; flex-direction:row; justify-content:stretch; align-items: stretch; }
  :global(.SurfDayV3) { flex:1; position:relative; }
  :global(.SurfDayV3:first-child) { display:none; }
  :global(.SurfDayV3 > div:first-child) { display:none; height:20px; font-size:11px; white-space:nowrap; text-align:center; line-height:25px; color:rgba(255,255,255,0.4); text-transform:uppercase; }
  :global(.SurfDayV3 > div:nth-child(2)) { position:absolute; bottom:15px; left:0; width:100%; z-index:1; font-size:12px; white-space:nowrap; text-align:center; display:flex; justify-content:center; align-items: center;}
  :global(.SurfDayV3 > div:nth-child(3)) { height:100%; }
  :global(.SurfDayV3 > div:nth-child(3) .NoBottomBorderForImage) { width: 100%; }
  :global(.SurfDayV3 > div:nth-child(3) .NoBottomBorderForImage img) { width: 100%; }



  :global(.sprite) { position:relative; border-radius:100%; width:8px; height:8px; }
  :global(.sprite:before) {content:''; display:block; position:absolute; left:-15px; border-radius:100%; width:8px; height:8px; }
  :global(.sprite:after) {content:''; display:block; position:absolute; right:-15px; border-radius:100%; width:8px; height:8px; }
  :global(.sprite.sprite-etoiles-0-bis) { display:none; }
  :global(.sprite.sprite-etoiles-0-bis:before) { display:none; }
  :global(.sprite.sprite-etoiles-0-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-1-bis) { display:none; }
  :global(.sprite.sprite-etoiles-1-bis:before) { background:#3f0; }
  :global(.sprite.sprite-etoiles-1-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-2-bis) { background:#3f0; transform:translateX(8px); }
  :global(.sprite.sprite-etoiles-2-bis:before) { background:#3f0; }
  :global(.sprite.sprite-etoiles-2-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-3-bis) { background:#3f0; }
  :global(.sprite.sprite-etoiles-3-bis:before) { background:#3f0; }
  :global(.sprite.sprite-etoiles-3-bis:after) { background:#3f0; }

  /* tablet mode */
  @media screen and (max-width:800px) {
    .surfometer { width:100%; }
  }

  /* decktop mode */
  @media screen and (min-width:800px) {
    :global(.NoBottomBorderForImage) { width: 100%; height: 100%; }
  }
</style>