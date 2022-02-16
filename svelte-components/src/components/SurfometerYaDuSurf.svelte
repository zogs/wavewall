<script>

  import { onMount } from 'svelte';
  import Loader from './Loader.svelte';

  export let name;
  export let content;
  export let id;

  let canvas = null;
  let surfometer = null;

  // on mount, fetch the image
  onMount(async() => {

      drawTide();
  });

  function drawTide() {

    var data = surfometer.getElementsByClassName('SurfometerV3')[0].dataset.tides;
    data = JSON.parse(data);

    const tides = [];
    data.map((t, i) => {
      tides.push({
        x: getPercentFromBegining(t.BM1, i),
        y: parseInt(t.Coef),
        m: 'BM',
        c: t.Coef,
      });
      tides.push({
        x: getPercentFromBegining(t.BM2, i),
        y: parseInt(t.Coef2),
        m: 'BM',
        c: t.Coef2,
      });
      tides.push({
        x: getPercentFromBegining(t.HM1, i),
        y: -parseInt(t.Coef),
        m: 'HM',
        c: t.Coef,
      });
      tides.push({
        x: getPercentFromBegining(t.HM2, i),
        y: -parseInt(t.Coef2),
        m: 'HM',
        c: t.Coef2,
      });
    })

    tides.sort((a,b) => a.x > b.x ? 1 : -1);

    var ctx = canvas.getContext("2d");
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.fillStyle = '#fff';  // a color name or by using rgb/rgba/hex values

    console.log(tides);
    const size = 5;

    tides.map(t => {
      let x = t.x * width / 100;
      let y = 80;

      let maree = t.m;
      let dir = maree == 'HM' ? -1 : 1;

      if(maree == 'HM') {
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.moveTo(x, y);
        ctx.lineTo(x-size, y-(size*dir))
        ctx.lineTo(x+size, y-(size*dir))
        ctx.fill();
        ctx.closePath();

        const coef = t.c;
        ctx.fillText(coef, x, y - 10);
      }

      if(maree == 'BM') {
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.moveTo(x, y+5);
        ctx.lineTo(x-size, y-(size*dir)+5)
        ctx.lineTo(x+size, y-(size*dir)+5)
        ctx.fill();
        ctx.closePath();
      }
      //console.log(x,y);

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
  <div class="tides"><canvas bind:this={canvas} width=1000 height=100></canvas></div>
  {@html content }
</div>

<style global>

  .surfometer { position:relative; width:100%;  margin-bottom:5px; /* flex: 1; */}
  .spotname { color:white; position:absolute; width:100%; height:100%; padding: 10px; display: flex; justify-content:flex-end; align-items: center; z-index:10; pointer-events: none; }
  .spotname span { font-family:helvetica; font-family: 'Ranchers', cursive; font-size:36px; color:rgba(255,255,255,1); text-shadow:2px 2px 5px rgba(0,0,0,0.8); letter-spacing:2px; }

  .tides { position:absolute; bottom:0; width:100%; z-index:10;}
  .tides canvas { width:100%; }

  .loader { position:absolute; top:40%; left:50%; }
  :global(.SurfometerV3) { display:flex; flex-direction:row; justify-content:stretch; align-items: stretch; }
  :global(.SurfDayV3) { flex:1; position:relative; }
  :global(.SurfDayV3:first-child) { display:none; }
  :global(.SurfDayV3 > div:first-child) { display:none; height:20px; font-size:11px; white-space:nowrap; text-align:center; line-height:25px; color:rgba(255,255,255,0.4); text-transform:uppercase; }
  :global(.SurfDayV3 > div:nth-child(2)) { position:absolute; bottom:15px; left:0; width:100%; z-index:1; font-size:12px; white-space:nowrap; text-align:center; display:flex; justify-content:center; align-items: center;}
  :global(.SurfDayV3 > div:nth-child(3)) { height:100%; }
  :global(.SurfDayV3 > div:nth-child(3) .NoBottomBorderForImage) { width: 100%; height:100%; }
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

</style>