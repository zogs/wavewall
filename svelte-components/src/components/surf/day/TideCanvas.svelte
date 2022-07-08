<script>

  import { onMount, tick } from 'svelte';
  import * as createjs from 'createjs-module';
  import loadImage from 'image-promise';
  import { debounce } from 'throttle-debounce';
  import {scaleLinear} from 'd3-scale';

  let data;
  let stage;
  let canvas;
  let width = 0;
  let height = 0;
  let color = '#333';

  onMount(async() => {

    await tick();
    setTimeout(resize, 1000); // fix to be compatible with YaDuSurf Surfometer (wait img loads)

    data = {
      hours: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      tide: ['PM', 'BM', 'PM', 'BM', 'PM', 'BM'],
      coef: [60, 65, 73, 84, 78, 69]
    }

  });

  function resize() {
    const parent = canvas.parentNode;
    width = parent.clientWidth;
    height = parent.clientHeight;
    draw();
  }

  async function preloadAssets() {

  }

  async function draw() {

    await preloadAssets();

    stage = new createjs.Stage(canvas);
    stage.removeAllChildren();

    //curve.graphics.setStrokeStyle(1).beginStroke('#FF0000');

    const middle = height / 2;
    const maxCoef = 120;
    const minCoef = 30;
    const maxAmplitude = height / 2;
    const minAmplitude = height / 6;
    const points = [];

    const m0 = convertHourstoMinutes(data.hours[0]);
    const x0 = convertMinutesToX(m0 - 60*6);
    const y0 = middle;
    points.push({x: x0, y: y0});

    for(let i=0; i < data.hours.length; i++) {

      const hour = data.hours[i];
      const m = convertHourstoMinutes(hour);
      const x = convertMinutesToX(m);
      const c = data.coef[i];
      const amplitude = scaleLinear().domain([minCoef,maxCoef]).range([minAmplitude,maxAmplitude])(c)
      const dy = data.tide[i] === 'PM' ? -1 : 1;
      const y =  middle + (amplitude * dy);
      const t = data.tide[i];
      points.push({x, y, c, t});
    }

    const mZ = convertHourstoMinutes(data.hours[data.hours.length-1]);
    const xZ = convertMinutesToX(mZ + 60*6);
    const yZ = middle;
    points.push({x: xZ, y: yZ});


    const curve = new createjs.Shape();
    curve.graphics.beginFill(color);
    curve.graphics.setStrokeStyle(1).beginStroke('#000');
    curve.graphics.moveTo(x0, y0);
    for(let i=1; i < points.length-1; i++) {
      const p0 = points[i-1];
      const p1 = points[i];
      const x0 = p0.x;
      const y0 = p0.y;
      const x1 = p1.x;
      const y1 = p1.y;
      const w = 15;
      curve.graphics.bezierCurveTo(x0+w, y0, x1-w, y1, x1, y1);
    }

    curve.graphics.lineTo(xZ, yZ);
    curve.graphics.lineTo(xZ, height);
    curve.graphics.lineTo(0, height);
    curve.graphics.lineTo(0, y0);

    const stripes = new createjs.Container();
    const stripeHeight = height / 10;
    for(let i = 0; i <= 10; i++) {
      const strip = new createjs.Shape();
      const color = i % 2 ? '#FFF' : '#CCC';
      strip.graphics.beginFill(color).rect(0,0, width, height);
      strip.y = stripeHeight * i;
      stripes.addChild(strip);
    }

    const blackLine = new createjs.Shape();
    blackLine.graphics.setStrokeStyle(1).beginStroke('#000');
    blackLine.graphics.lineTo(0, height/2).lineTo(width, height/2);

    stage.addChild(stripes);
    //stage.addChild(blackLine);
    stage.addChild(curve);


    for(let i=1; i < points.length-1; i++) {
      const p = points[i];
      const x = p.x;
      const coef = p.c;
      const tide = p.t;
      const textColor = tide === 'PM' ? '#FFF' : '#000';
      const font = tide === 'PM' ? '10px arial' : '9px arial';
      const label = new createjs.Text(coef, font, textColor);
      label.x = x - label.getBounds().width / 2;
      label.y = tide === 'PM' ? p.y + label.getBounds().height - 5: p.y - label.getBounds().height - 2;
      stage.addChild(label);
    }

    stage.update();
  }

  function convertMinutesToX(m) {
    const maxMinutes = 60*24;
    const x = width * m/maxMinutes;
    return x;
  }

  function convertHourstoMinutes(t){
    var timeParts = t.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

</script>

<svelte:window on:resize={debounce(200,resize)} />

<canvas bind:this={canvas} {width} {height}></canvas>

<style>
  canvas { width:100%; height:100%; background: linear-gradient(0deg, #dbdbdb 45%, #fff 100%); }
</style>