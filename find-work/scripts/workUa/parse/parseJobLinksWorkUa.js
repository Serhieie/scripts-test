const puppeteer = require('puppeteer');
const fs = require('fs');
const { scrollDown, getJobLinks, nextPage } = require('../../../helpers');
const { spamScriptWorkUa } = require('../spam/spamScriptWorkUa');

async function parseJobLinksWorkUa(links, index) {
  const jobLinksSelector =
    '#pjax-jobs-list > .card-search div.add-bottom > h2 > a';
  if (index >= links.length) {
    console.log('All links processed.');
    let lastData = JSON.parse(fs.readFileSync('searchResultWorkUa.json'));
    await spamScriptWorkUa(lastData);
    return;
  }
  const filteredJobsLink = links[index];

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();
  // Navigate the page to a URL
  await page.goto(filteredJobsLink);

  //scroll down
  await scrollDown(page);

  const pages = await page.$$('ul.pagination.text-center > li');
  pages.shift();

  let vacancies = await getJobLinks(page, jobLinksSelector);

  for (let i = 0; i < pages.length; i++) {
    await nextPage(filteredJobsLink, page);
    await scrollDown(page);

    let nextVacancies = await getJobLinks(page, jobLinksSelector);
    vacancies = vacancies.concat(nextVacancies);
  }

  // Read the existing data from the file
  let existingData = JSON.parse(fs.readFileSync('searchResultWorkUa.json'));

  // Concatenate the existing data with new vacancies
  let newData = existingData.concat(vacancies);

  // Write the updated data back to the file
  fs.writeFileSync('searchResultWorkUa.json', JSON.stringify(newData));

  await browser.close();
  await parseJobLinksWorkUa(links, index + 1);
}

module.exports = { parseJobLinksWorkUa };
