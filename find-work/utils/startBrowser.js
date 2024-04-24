const puppeteer = require('puppeteer');

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  return { page, browser };
};

module.exports = { startBrowser };
