const puppeteer = require('puppeteer');
const fs = require('fs');
const searchResult = require('../../../searchResultRobotaUa.json');
const {
  scrollDown,
  getJobLinksRabotaUa,
  isSearchResultExist,
} = require('../../../helpers');

const filteredJobsLinc = 'https://robota.ua/zapros/junior-back-end/ukraine';

//node ./scripts/rabotaUa/parse/parseJuniorFront.js

(async () => {
  //Old Vacancies if no need coment
  let linksArray = await isSearchResultExist(searchResult);
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  // Navigate the page to a URL
  await page.goto(filteredJobsLinc);

  //scroll down
  await scrollDown(page);

  const pages = await page.$$('santa-pagination-with-links > div > a');
  pages.shift();

  let vacancies = await getJobLinksRabotaUa(page);

  for (const page of pages) {
    await page.click();
    await scrollDown(page);
    let nextVacancies = await getJobLinksRabotaUa(page);
    vacancies = vacancies.concat(nextVacancies);
  }
  vacancies = vacancies.concat(linksArray);
  let result = JSON.stringify(vacancies);
  // fs.writeFile('searchResultJuniorBackEnd.json', result, function (err) {
  fs.writeFile('searchResultRobotaUa.json', result, function (err) {
    if (err) throw new Error(err);
  });
  // Print the full title

  await browser.close();
})();
