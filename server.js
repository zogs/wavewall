var server = '127.0.0.1';
var port = 1337;

const express = require('express')
const request = require('request')
const app = express()
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')
const puppeteer = require("puppeteer");

const extractor = require('./extractor.js')

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'hbs');
app.use(cookieParser())

app.engine('hbs', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs',
  defaultLayout: 'index',
}))

app.get('/', (req, res) => {
  //res.cookie('url1', 'http://test', {maxAge: 10800})
  res.render('main', {test: 'test'})
  console.log(req.headers)
})

app.get('/showdatetime', (req, res) => {
  res.render('datetime', { date: new Date().toLocaleDateString('fr-FR'), time: new Date().toLocaleTimeString('fr-FR') })
})

app.get('/datetime', (req, res) => {
  let url = 'http://genpdf.nebulab.dev/screenshot?url=http://zogs.org:1337/showdatetime&options='+encodeURIComponent(JSON.stringify({width:300, height:900}));
  request({url: url, encoding: null, headers: {"X-APIKEY": "AWGBQBI-SPAUPCY-VVMDK6Y-OZUUZJI"}},  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
      res.set("Content-Type", "image/jpeg");
      res.send(resp.body);
    }
  });
})

app.get('/fetch', async (req, res) => {

  let url = req.query.url;
  let surfometer = await extractor.getSurfometer(url)
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.write(surfometer);
  res.end();
})

app.get('/spots', async(req, res) => {

  let list = await extractor.getSpotsList();
  list = JSON.stringify(list);
  res.writeHead(200, {"Content-Type":"text/plain"});
  res.write(list);
  res.end();
})

app.get('/snap', async(req, res) => {

  // open the browser and prepare a page
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // set the size of the viewport, so our screenshot will have the desired size
  await page.setViewport({
      width: 1404,
      height: 1872
  })

  await page.goto('http://localhost:1337', {"waitUntil" : "networkidle0"});
  page.waitFor(3000);
  await page.screenshot({
      path: 'screenshot.png',
      fullPage: true
  })

  // trigger the response
  res.sendFile('screenshot.png', { root: '/var/www/zogs/surfwall'});

  // close the browser
  await browser.close();
})

app.listen(port, () => {
  console.log(`Server running at ${server}:${port}`);
})
