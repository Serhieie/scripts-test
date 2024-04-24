const puppeteer = require('puppeteer');
const fs = require('fs');
const searchResult = require('../../../searchResultWorkUa.json');
const {
  scrollDown,
  getJobLinks,
  nextPage,
  isSearchResultExist,
} = require('../../../helpers');

const filteredJobsLinc = 'https://www.work.ua/jobs-junior+front+end/';

//node ./scripts/workUa/parse/parseJuniorFront.js

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

  const pages = await page.$$('ul.pagination.text-center > li');
  pages.shift();

  let vacancies = await getJobLinks(page);

  for (let i = 0; i < pages.length; i++) {
    await nextPage(filteredJobsLinc, page);
    await scrollDown(page);

    let nextVacancies = await getJobLinks(page);
    vacancies = vacancies.concat(nextVacancies);
  }

  //if no need comment
  vacancies = vacancies.concat(linksArray);
  let result = JSON.stringify(vacancies);
  // fs.writeFile('searchResultJuniorFront.json', result, function (err) {
  fs.writeFile('searchResultWorkUa.json', result, function (err) {
    if (err) throw new Error(err);
  });

  await browser.close();
})();
