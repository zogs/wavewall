const puppeteer = require("puppeteer");

// we're using async/await - so we need an async function, that we can run
const run = async () =>
 {
  // open the browser and prepare a page
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })


  const page = await browser.newPage()

  // set the size of the viewport, so our screenshot will have the desired size
  await page.setViewport({
      width: 800,
      height: 1200
  })

  await page.goto('http://localhost:1337', {"waitUntil" : "networkidle0"});
  page.waitFor(3000);
  await page.screenshot({
      path: 'screenshot.png',
      fullPage: true
  })

  // close the browser
  await browser.close();
};

// run the async function
run();
