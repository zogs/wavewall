<script>

  import { onMount, tick } from 'svelte';
  import * as createjs from 'createjs-module';
  import loadImage from 'image-promise';
  import { debounce } from 'throttle-debounce';

  let data;
  let cloudCovers;
  let rainAmounts;
  let stage;
  let canvas;
  let width = 0;
  let height = 0;
  let bitmapSun;
  let bitmapCloud1;
  let bitmapCloud2;
  let bitmapCloud3;

  onMount(async() => {

    await tick();
    setTimeout(resize, 1000); // fix to be compatible with YaDuSurf Surfometer (wait img loads)

    data = {
      //cover: [10,10,10,10,10,10, 25,25,25,25,25,25, 75,75,75,75,75,75, 100,100,100,100,100],
      //cover: [100,100,100,100,100,100,100,100, 0,0,0,0,0,0,0,0, 100,100,100,100,100,100,100],
      //cover: [100,100,100,100,100,100,100,100, 100,100,100,100,100,100,100,100, 100,100,100,100,100,100,100],
      cover: createRandomCover(),
      rain: [0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]
    }

    cloudCovers = data.cover;
    rainAmounts = data.rain;

  });

  function resize() {
    const parent = canvas.parentNode;
    width = parent.clientWidth;
    height = parent.clientHeight;
    draw();
  }

  async function preloadAssets() {
    const images = await loadImage([
      '/img/sun.png',
      '/img/cloud1.png',
      '/img/cloud2.png',
      '/img/cloud3.png',
    ]);
    bitmapSun = new createjs.Bitmap(images[0]);
    bitmapSun.regX = images[0].width/2;
    bitmapSun.regY = images[0].height/2;
    bitmapCloud1 = new createjs.Bitmap(images[1]);
    bitmapCloud1.regX = images[1].width/2;
    bitmapCloud1.regY = images[1].height/2;
    bitmapCloud2 = new createjs.Bitmap(images[2]);
    bitmapCloud2.regX = images[2].width/2;
    bitmapCloud2.regY = images[2].height/2;
    bitmapCloud3 = new createjs.Bitmap(images[3]);
    bitmapCloud3.regX = images[3].width/2;
    bitmapCloud3.regY = images[3].height/2;

  }

  async function draw() {

    await preloadAssets();

    stage = new createjs.Stage(canvas);
    stage.removeAllChildren();

    const sun = bitmapSun.clone();
    sun.scaleX = sun.scaleY = 0.7;
    sun.x = width/2;
    sun.y = 50
    stage.addChild(sun);


    const covers = getPeriodAverage(cloudCovers, 8);

    let columnWidth = width/covers.length;

    let firstColumnX = 0;
    let secondColumnX = columnWidth;
    let thirdColumnX = columnWidth * 2;

    let firstColumnCover = covers[0];
    let secondColumnCover = covers[1];
    let thirdColumnCover = covers[2];

    createCloudsColumn(firstColumnX, columnWidth, firstColumnCover);
    createCloudsColumn(thirdColumnX, columnWidth, thirdColumnCover);
    // second column at last to make clouds on first plan
    createCloudsColumn(secondColumnX, columnWidth, secondColumnCover);


    //stage.addChild(swellLine);
    stage.update();
  }

  function createCloudsColumn(ox, columnWidth, cover) {

      // debug
      //const column = new createjs.Shape();
      //column.graphics.setStrokeStyle(1).beginStroke('red');
      //column.graphics.moveTo(ox, 0);
      //column.graphics.lineTo(ox, height);
      //stage.addChild(column);

      let percentOfCloud = cover;
      let ratioOfCloud = percentOfCloud / 100;
      let cloudFloor = height / 3;
      let cloudCeil = height / 4;

      let scale = 0;
      let alpha = 0;
      let numberOfCloud = 0;

      if(percentOfCloud >= 90) {
        numberOfCloud = 4;
        scale = 0.6;
        alpha = 1;
      }
      else if(percentOfCloud >= 75) {
        numberOfCloud = 4;
        scale = 0.5;
        alpha = 0.75;
      }
      else if(percentOfCloud >= 50) {
        numberOfCloud = 3;
        cloudFloor = height / 3;
        cloudCeil = height/8;
        scale = 0.4;
        alpha = 0.55;
      }
      else if(percentOfCloud >= 25) {
        numberOfCloud = 2;
        cloudCeil = 0;
        scale = 0.33;
        alpha = 0.5;
      }
      else if(percentOfCloud >= 5) {
        cloudCeil = height / 10;
        numberOfCloud = 1;
        scale = 0.25;
        alpha = 0.5;
      }

      let oy = cloudFloor;
      let dy = (cloudFloor - cloudCeil) / numberOfCloud;
      let dx = 0;

      for(let j=1; j <= numberOfCloud; j++) {

        const cloud = createRandomCloud();
        const entropy = Math.random()*2 - 1;

        let rx = 20 * entropy;
        let x = ox + (columnWidth / 2) + dx + rx;
        let y = oy;

        cloud.x = x;
        cloud.y = y;
        cloud.scaleX = scale;
        cloud.scaleY = scale;
        const sx = Math.sign(1 - Math.random()*2);
        cloud.scaleX *= sx;
        cloud.alpha = alpha;
        stage.addChild(cloud);

        oy -= dy;

      }

  }

  function createRandomCloud() {
    const rand = Math.random()*100;
    if(rand <= 33) return bitmapCloud1.clone();
    if(rand <= 66) return bitmapCloud2.clone();
    if(rand <= 100) return bitmapCloud3.clone();
  }

  function getPeriodAverage(array, hours = 6) {
    let periods = [];
    for (let i = 0; i < array.length; i += hours) {
        const chunk = array.slice(i, i + hours);
        const sum = chunk.reduce((a,b) => a + b, 0);
        const avg = sum/chunk.length
        periods.push(avg);
    }
    return periods;
  }

  function createRandomCover() {
    let arr = [];
    let v = Math.floor(Math.random()*100);
    for (var i=1; i <= 8; i++) arr.push(v);
    v = Math.floor(Math.random()*100);
    for (var i=1; i <= 8; i++) arr.push(v/2);
    v = Math.floor(Math.random()*100);
    for (var i=1; i <= 8; i++) arr.push(v);
    return arr;
  }

</script>

<svelte:window on:resize={debounce(150,resize)} />

<canvas bind:this={canvas} {width} {height}></canvas>

<style>
  canvas { width:100%; height:100%; background: linear-gradient(180deg, #dbdbdb 0%, #fff 50%); }
</style>