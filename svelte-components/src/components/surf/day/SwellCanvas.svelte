<script>

  import { onMount, tick } from 'svelte';
  import * as createjs from 'createjs-module';
  import loadImage from 'image-promise';
  import { debounce } from 'throttle-debounce';
  import {scaleLinear} from 'd3-scale';

  let stage
  let ctx
  let canvas
  let width
  let height
  let patternImage
  let swellArrowImg
  let data = [];

  const topSwell = 6;
  const swell0 = () => data[0].height;
  const period0 = () => data[0].period;
  const direction0 = () => data[0].direction;
  const swellToY = (h) => {
    let div = height / topSwell;
    let r = 0;
    r = height - (div * h)
    return r;
  };

  onMount(async() => {

    let images = await loadImage(['/img/water_surface_texture.png', '/img/swell_arrow.png'])

    patternImage = images[0]
    swellArrowImg = images[1]

    const nbdata = 3;
    for(let i=1; i <= nbdata; i++) {
      data.push({
        height: 0.5 + Math.random()*3,
        period: Math.ceil(7 + Math.random()* 7),
        direction: Math.random()*360, // TODO: change to radians
      });
    }

    await tick();
    setTimeout(resize, 1000); // fix to be compatible with YaDuSurf Surfometer (wait img loads)

  });

  async function resize() {
    const parent = canvas.parentNode;
    width = parent.clientWidth;
    height = parent.clientHeight;
    await tick();
    draw();
  }

  function draw() {

    stage = new createjs.Stage(canvas);
    ctx = stage.canvas.getContext("2d");

    const points = data.map((d,i) => {
      return { x: i * width / (data.length-1), y: swellToY(d.height)}
    })

    const allSwell = data.map(d => d.height);
    const maxSwell = Math.max(...allSwell);

    /**
     * Swell
     */
    const swellWhiteBackground = new createjs.Shape();
    swellWhiteBackground.graphics.beginFill('#fff');
    swellWhiteBackground.graphics.moveTo((points[0].x), points[0].y);
    for(var i = 0; i < points.length-1; i ++)
    {
      var x_mid = (points[i].x + points[i+1].x) / 2;
      var y_mid = (points[i].y + points[i+1].y) / 2;
      var cp_x1 = (x_mid + points[i].x) / 2;
      var cp_x2 = (x_mid + points[i+1].x) / 2;
      swellWhiteBackground.graphics.quadraticCurveTo(cp_x1,points[i].y ,x_mid, y_mid);
      swellWhiteBackground.graphics.quadraticCurveTo(cp_x2,points[i+1].y ,points[i+1].x,points[i+1].y);
    }

    swellWhiteBackground.graphics.lineTo(width, height);
    swellWhiteBackground.graphics.lineTo(0, height);
    swellWhiteBackground.graphics.endStroke();

    const swellWaterPattern = new createjs.Shape();
    const patternImage0 = new createjs.Bitmap(patternImage);
    const dw = Math.random()*50
    const dh = Math.random()*50
    patternImage0.cache(dw, dh, patternImage.width, patternImage.height);
    const pattern = ctx.createPattern(patternImage0.cacheCanvas, 'repeat')
    swellWaterPattern.graphics.beginFill(pattern);
    swellWaterPattern.graphics.moveTo((points[0].x), points[0].y);
    for(var i = 0; i < points.length-1; i ++)
    {
      var x_mid = (points[i].x + points[i+1].x) / 2;
      var y_mid = (points[i].y + points[i+1].y) / 2;
      var cp_x1 = (x_mid + points[i].x) / 2;
      var cp_x2 = (x_mid + points[i+1].x) / 2;
      swellWaterPattern.graphics.quadraticCurveTo(cp_x1,points[i].y ,x_mid, y_mid);
      swellWaterPattern.graphics.quadraticCurveTo(cp_x2,points[i+1].y ,points[i+1].x,points[i+1].y);
    }

    swellWaterPattern.graphics.lineTo(width, height);
    swellWaterPattern.graphics.lineTo(0, height);
    swellWaterPattern.graphics.endStroke();
    swellWaterPattern.alpha = 0.5;


    const swellLine = new createjs.Shape();
    swellLine.graphics.setStrokeStyle(4);
    swellLine.graphics.beginStroke("rgb(0,0,0)");

    swellLine.graphics.moveTo((points[0].x), points[0].y);
    for(var i = 0; i < points.length-1; i ++)
    {
      var x_mid = (points[i].x + points[i+1].x) / 2;
      var y_mid = (points[i].y + points[i+1].y) / 2;
      var cp_x1 = (x_mid + points[i].x) / 2;
      var cp_x2 = (x_mid + points[i+1].x) / 2;
      swellLine.graphics.quadraticCurveTo(cp_x1,points[i].y ,x_mid, y_mid);
      swellLine.graphics.quadraticCurveTo(cp_x2,points[i+1].y ,points[i+1].x,points[i+1].y);
    }

    swellLine.graphics.endStroke();


    const swellDirectionPattern = createDirectionPattern();
    swellDirectionPattern.alpha = 1;
    swellDirectionPattern.mask = swellWhiteBackground;


    /**
     * Ticks & Size
    */
    const step = 1;
    for (let i = 1; i <= topSwell; i++) {
      const line = new createjs.Shape();
      line.graphics.setStrokeStyle(0.5).beginStroke('rgba(0,0,0,0.15)').moveTo(0,0).lineTo(width,0);
      let size = step * i;
      let y = swellToY(size);
      line.y = y;
      stage.addChild(line);
    }
    const digit = new createjs.Text(maxSwell.toFixed(1)+'m', 'bold 16px monospace', 'rgba(255,255,255,1)')
    const bounds = digit.getBounds();
    digit.x = width - 2;
    digit.y = swellToY(maxSwell) - 9
    digit.textAlign = 'right'

    const outline = new createjs.Text(maxSwell.toFixed(1)+'m', 'bold 16px monospace', 'rgba(0,0,0,1)')
    outline.x = digit.x ;
    outline.y = digit.y ;
    outline.outline = 3;
    outline.textAlign = 'right';

    const dashline = new createjs.Shape();
    dashline.graphics.setStrokeStyle(1);
    dashline.graphics.setStrokeDash(([8, 4])).beginStroke('rgba(0,0,0,0.25)');
    dashline.graphics.moveTo(0, digit.y + bounds.height / 2).lineTo(digit.x - bounds.width - 4, digit.y + bounds.height / 2);
    dashline.y = 1;

    stage.addChild(dashline);

    stage.addChild(swellWhiteBackground)
    stage.addChild(swellWaterPattern);
    stage.addChild(swellDirectionPattern);
    stage.addChild(swellLine);

    stage.addChild(outline)
    stage.addChild(digit)


    /**
     * Direction
    */
    const arrow = new createjs.Bitmap(swellArrowImg)
    arrow.regX = arrow.getBounds().width / 2
    arrow.regY = arrow.getBounds().height / 3
    arrow.scaleX = arrow.scaleY = 1.25;
    let arrow_y = swellToY(swell0()) - 10
    if(arrow_y > height - arrow.getBounds().height/2) arrow_y = height - arrow.getBounds().height/2
    let arrow_x = 24;
    if(direction0() >= 180) arrow_x = 14;
    arrow.x = arrow_x
    arrow.y = arrow_y
    arrow.rotation = direction0();
    stage.addChild(arrow)
    const shadow = arrow.clone();
    shadow.filters = [new createjs.ColorFilter(0,0,0,0, 0,0,0,1)]
    shadow.cache(0,0, 100, 100);
    let shadowDepth = 5;
    for (let i = 1; i <= shadowDepth; i++) {
      let shade = shadow.clone();
      shade.x = arrow.x;
      shade.y = arrow.y - i;
      //stage.addChild(shade);
    }
    const digit2 = new createjs.Text(period0()+'s', 'bold 12px cursive', 'rgba(0,0,0,1)')
    digit2.textAlign = 'center'
    digit2.x = arrow.x
    digit2.y = arrow.y - 4
    stage.addChild(digit2)



    /**
     * Hours
    */
    let total = 24
    let hours = [4,8,12,16,20]
    let div = width / 24
    const cadre = new createjs.Shape();
    cadre.graphics.beginFill('#777').rect(0,0, width, 8);
    cadre.y = height - 8;
    stage.addChild(cadre);
    for (let i = 1; i < total; i++) {
      if(false == hours.some(h => h == i)) continue;
      const x = div * i
      const y = cadre.y;
      const w = 3;
      const tick = new createjs.Shape();
      tick.graphics.setStrokeStyle(2).beginStroke('#777').beginFill('#777')
                    .moveTo(-w/2,0).lineTo(0, -w/2).lineTo(w/2, 0);
      tick.x = x
      tick.y = y
      stage.addChild(tick)
      const digit = new createjs.Text(i, '11px helvetica', '#FFF')
      digit.x = x
      digit.y = cadre.y + 3;
      digit.scaleY = 0.5
      digit.textAlign = 'center'
      stage.addChild(digit)
    }

    stage.update();

  }

  function createDirectionPattern() {

    const arrowMaxLength = 30;
    const arrowMaxBase = 14;
    const arrowOffset = 15;

    const createArrow = (dir = 0, period = 10, swell = 2) => {
      const w = scaleLinear().domain([0,20]).range([5,arrowMaxBase])(period)
      const h = scaleLinear().domain([0,20]).range([0,arrowMaxLength])(period)
      const a = new createjs.Shape()
      a.graphics.beginStroke('rgba(0,0,0,0.4)').beginFill('rgba(255,255,255,0.8')
       .moveTo(0,0)
       .lineTo(w/2, -h)
       .lineTo(0, -h*4/5)
       .lineTo(-w/2, -h)
       .closePath()
      a.regX = 0
      a.regY = -h*3/5
      a.rotation = dir
      a.size = h;
      a.swell = swell;
      return a;
    }

    const createAndFillContainer = (w, h, arrow) => {
      const container = new createjs.Container();
      let size = arrowOffset;
      let xdiv = Math.floor(w / (size));
      let ydiv = Math.floor(h / (size));
      for(let i=0; i < xdiv; i++) {
        for(let j=0; j < ydiv; j++) {
          const obj = arrow.clone();
          obj.x = i * (size) + size/2;
          obj.y = j * (size) + ydiv;
          obj.alpha = 1;
          container.addChild(obj);
          break;
        }
      }
      const y = swellToY(arrow.swell);
      container.y = y;
      return container;
    }

    const createLinearInterpolatePattern = (w, h, swell1, dir1, per1, swell2, dir2, per2) => {
      const container = new createjs.Container();
      let nbcol = w / arrowOffset;
      nbcol = Math.floor(nbcol);
      let w_col = w / nbcol;
      for(let i=0; i < nbcol; i++) {
        const x = i * (w_col);
        const dir = scaleLinear().domain([0,w-w_col]).range([dir1,dir2])(x);
        const period = scaleLinear().domain([0,w-w_col]).range([per1,per2])(x);
        const swell = scaleLinear().domain([0,w-w_col]).range([swell1,swell2])(x);
        const arrow = createArrow(dir, period, swell);
        const col = createAndFillContainer(w_col, h, arrow)
        col.x = x;
        container.addChild(col);
      }
      return container;
    }


    const container = new createjs.Container();
    for(let i=0; i < data.length - 1; i++) {
      const data1 = data[i];
      const data2 = data[i+1];
      const w = width/(data.length-1);
      const div = createLinearInterpolatePattern(w, height, data1.height, data1.direction, data1.period, data2.height, data2.direction, data2.period);
      div.x = w * i;
      container.addChild(div);
    }

    return container;
  }

</script>

<svelte:window on:resize={debounce(200,resize)} />

<canvas bind:this={canvas} {width} {height}></canvas>

<style>
  canvas { width:100%; height:100%;  }
</style>