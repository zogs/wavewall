var server = '127.0.0.1';
var port = 1337;

const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')

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

app.listen(port, () => {
  console.log(`Server running at ${server}:${port}`);
})
