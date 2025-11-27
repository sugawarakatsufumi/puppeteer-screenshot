import puppeteer from "puppeteer";

const sizes = [
  { width: 375, height: 836, name: "iphone-375" },
];

const urls = [
  "https://www.kattsu.com",

];
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  let page = await browser.newPage();
  for(const url of urls){
    let urlObject = new URL(url);
    for (const size of sizes) {
      try{
        await page.setViewport({ width: size.width, height: size.height });
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.evaluate(() => {
          const selectorsToRemove = [
            '#cookie-box'
          ];
          selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (el && el.parentNode) {
                el.parentNode.removeChild(el);
              }
            });
          });
        });
        let fileName = urlObject.hostname.replace(/\./g, '_');
        await page.screenshot({
          path: `./screenshots/${fileName}.png`,
          fullPage: false,
        });
        console.log('成功:'+urlObject.hostname);
      } catch (error) {
        console.log('失敗:'+urlObject.hostname);
      }
    }
    //console.log(urlObject.hostname+"\n");
  }
  await page.close();
  await browser.close();
})();
