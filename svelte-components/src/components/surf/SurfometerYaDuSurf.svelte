<script>

  import { onMount } from 'svelte';
  import Loader from '../Loader.svelte';

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
        h: t.BM1,
        x: getPercentFromBegining(t.BM1, i),
        y: parseInt(t.Coef),
        m: 'BM',
        c: t.Coef,
      });
      tides.push({
        h: t.BM2,
        x: getPercentFromBegining(t.BM2, i),
        y: parseInt(t.Coef2),
        m: 'BM',
        c: t.Coef2,
      });
      tides.push({
        h: t.HM1,
        x: getPercentFromBegining(t.HM1, i),
        y: -parseInt(t.Coef),
        m: 'HM',
        c: t.Coef,
      });
      tides.push({
        h: t.HM2,
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
    ctx.font = '11px Arial';
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.fillStyle = '#fff';  // a color name or by using rgb/rgba/hex values

    tides.map(t => {
      let x = t.x * width / 100;
      let y = 80;

      let maree = t.m;
      let dir = maree == 'HM' ? -1 : 1;

      if(maree == 'HM') {
        const coef = parseFloat(t.c)+25;
        let size = 3;
        if(coef >= 60) size = 5;
        if(coef >= 80) size = 8;
        if(coef >= 100) size = 8;

        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.moveTo(x, y);
        ctx.lineTo(x-size, y-(size*dir))
        ctx.lineTo(x+size, y-(size*dir))
        ctx.lineTo(x,y)
        ctx.stroke();
        if(coef >= 100) ctx.fill();
        ctx.closePath();

        const time = t.h.replace(' ','');
        ctx.fillText(time, x, y - 10);

        //console.log(time, coef, size);
      }

      /*if(maree == 'BM') {
        ctx.beginPath();
        ctx.fillStyle = '#FFF';
        ctx.moveTo(x, y+5);
        ctx.lineTo(x-size, y-(size*dir)+5)
        ctx.lineTo(x+size, y-(size*dir)+5)
        ctx.fill();
        ctx.closePath();
      }
      */

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
  :global(.SurfDayV3 > div:nth-child(2)) { position:absolute; bottom:45px; left:0; width:100%; z-index:1; font-size:12px; white-space:nowrap; text-align:center; display:flex; justify-content:center; align-items: center;}
  :global(.SurfDayV3 > div:nth-child(3)) { height:100%; }
  :global(.SurfDayV3 > div:nth-child(3) .NoBottomBorderForImage) { width: 100%; height:100%; }
  :global(.SurfDayV3 > div:nth-child(3) .NoBottomBorderForImage img) { width: 100%; }



  :global(.sprite) { position:relative; display:block; width:16px; height:16px; }
  :global(.sprite:before) { content:''; display:block; position:absolute; left:-20px;  width:16px; height:16px; }
  :global(.sprite:after) { content:''; display:block; position:absolute; right:-20px;  width:16px; height:16px; }
  :global(.sprite.sprite-etoiles-0-bis) { display:none; }
  :global(.sprite.sprite-etoiles-0-bis:before) { display:none; }
  :global(.sprite.sprite-etoiles-0-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-1-bis) { display:none; }
  :global(.sprite.sprite-etoiles-1-bis:before) { display:block; }
  :global(.sprite.sprite-etoiles-1-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-2-bis) { display:block; transform:translateX(8px); }
  :global(.sprite.sprite-etoiles-2-bis:before) { display:block; }
  :global(.sprite.sprite-etoiles-2-bis:after) { display:none; }
  :global(.sprite.sprite-etoiles-3-bis) { display:block; }
  :global(.sprite.sprite-etoiles-3-bis:before) { display:block; }
  :global(.sprite.sprite-etoiles-3-bis:after) { display:block; }

  :global(.sprite, .sprite:before, .sprite:after) {
    background-size: 100%;
    background-image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsgAAALIBa5Ro4AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAASBSURBVFiFvZdNbFRVFMd/9743M/2ezkw7M/1wgjhQECaiQYUiQmLChxqjIomJElE3uCDYjYgbJSRqXUHsxgUBbGIwwEKlNBoiYYWREGDTIFVbKNAOzfSDlk47894cF9Npaek0fSD9Jze5771z/ud/77kf58HDYel4m38UF/A+IICM9+cVhr+MgZwAXymDgDlv0YM+3gGkLqKkLqIEkKoA786bgEhItQPS9LEp3+4yBZBISF2dl+BuNzGlkNIiZPCUR+60esRbnE2Fy8VTTvm0U4cFIdUoAh+8bFBWDKVF8N4mA4CFYfWVUz6n8HlcWEohV5rdImc9Imc90v6DW7RG3C4sIOCE0NEMLAjr3WNpjM3Pa+oiauJ9tEax8VlNKo2xKKJ3PyoBxlBSdgDs3GLc9zH3LjGQ2QHcb5AHatpzAAgBlZGQsdhbLAu1pjZjS2Q4SXVHj0QX1SquNLvR06RnMrBkW4r2G8LjYfV3SRG3DK267Axdw0nV0dFt/wX0AnEgca/vG+Ul3DINbMYPlnxNa+TEPtdE7qe3E/tcovXsHICYBnZ5CbeA15VpELdsggDlJRD2K4I+RdgPIV+2XxWAoE+xIqp4LDh90qbiely4/I8Q7xO6E9A7IPT0CT192X53Qhi8m7U1DW6rogLOj4yy8skFitZvXERCswd4WFyPC5s/SdPWKRQVcF6PjPJmwKtutnUKqz5Kc7FdHlnwi+3ZGG2dQsCrbo6MskUDXYlBWRr2q/PdCeHFnSlazmX+9+CnL2RYvytFd0II+dXlxKAsB7py2yU1nORIyMfT/UMs/vH3DEGfYuUSxwfljDjcavP2XovkGIT8nI738RIwDFP3q313lKNhP6VDI6xuOZehfwg2PadRD7gsRGDvYYuGJptMBirLOXS7n62AlbO578AYTvJboIy+VJpNf7SJ6uiG19ZotEMRlg0fNlocOG5jaCTopeH2AJ9Nt5vxxEqO8WdJCRc1bL1wVXR1hWJlnbN0fPeLzZfNNgVurLJCtvTe4chMdnlZh4b4ubaSZoAbvc53xs1xn+oKvk8M8VM+u1mHZWfUaoBnFjtfjDkfkSzHgwgwevrkCYDVy5yvwjWxrE93QqLMcjnNJiCWHMMVrVGE/c4FhHyKhdWK0RQuIOZYQG1QbwBYtWxmk84eoaHJoqHJ4lp85jVSvzzrGwnrjY4FFHnkFYA1y6eOPm3BgeM2se0p9h+z2X/MZum2FF8cshhNTeXIpa7QJZvzxcmLgFf1A3Lp4GTpdfJrl0RrsmW4Ukhtpfq1yk+rUtlrNlqjpKVx8rq+dNAtgIxzOUIIkLJixDrjka7jbtm2wZi4zwNlxD0mE9NqmqwLeFVX7vur9Vr+PeoW+8xkxQxUzTm622ArIOtXaNm/05TigiyJx0XaV0oj4J7Bzaz0safQwxgghR7k8+2GvBDTAojb4K05C9CaPdxTwSiFVFXQMsdRhKsrOJlLC5PV1KdzFgDUK4VFNn/XCwpY58QZwDRZG/BybXwANlDvlCMGrOfhfjpNYC2wKJ/BfzWWzm89fxVaAAAAAElFTkSuQmCC');
  }

</style>