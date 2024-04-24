const puppeteer = require('puppeteer');
const fs = require('fs');
const { scrollDown, getJobLinks } = require('../helpers');
const { parseJobLinksWorkUa } = require('./workUa');
const { spamScriptRabotaUA } = require('./robotaUa');

const jobLinks = [
  'https://robota.ua/zapros/junior-front-end/ukraine',
  'https://robota.ua/zapros/junior-back-end/ukraine',
  'https://robota.ua/zapros/junior-full-stack/ukraine',
];

const jobLinksWorkUa = [
  'https://www.work.ua/jobs-junior+back+end/',
  'https://www.work.ua/jobs-junior+front+end/',
  'https://www.work.ua/jobs-junior+full+stack/',
];

//node ./scripts/searchWork.js

parseJobLinksRabotaUa(jobLinks, 0)
  .then(() => {
    console.log('First script completed.');
    parseJobLinksWorkUa(jobLinksWorkUa, 0);
  })
  .catch(error => {
    console.error('Error occurred in the first script:', error);
  });

async function parseJobLinksRabotaUa(links, index) {
  const jobLinkSelector =
    'alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a';

  if (index >= links.length) {
    console.log('Parsing completed.');
    let lastData = JSON.parse(fs.readFileSync('searchResultRobotaUa.json'));
    await spamScriptRabotaUA(lastData);
    return;
  }

  const filteredJobsLinc = links[index];

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

  let vacancies = await getJobLinks(page, jobLinkSelector);

  for (const page of pages) {
    await page.click();
    await scrollDown(page);
    let nextVacancies = await getJobLinks(page, jobLinkSelector);
    vacancies = vacancies.concat(nextVacancies);
  }

  // Read the existing data from the file
  let existingData = JSON.parse(fs.readFileSync('searchResultRobotaUa.json'));

  // Concatenate the existing data with new vacancies
  let newData = existingData.concat(vacancies);

  // Write the updated data back to the file
  fs.writeFileSync('searchResultRobotaUa.json', JSON.stringify(newData));

  await browser.close();
  await parseJobLinksRabotaUa(links, index + 1);
}
