const fs = require('fs');
const {
  scrollDown,
  getJobLinks,
  nextPage,
  writeLinks,
} = require('../../../helpers');
const { spamScriptWorkUa } = require('../spam/spamScriptWorkUa');
const { startBrowser } = require('../../../utils');
const selectors = require('../../selectors.json');

const workUaSelectors = selectors.workUa;

async function parseJobLinksWorkUa(links, index) {
  const jobLinksSelector = workUaSelectors.jobLinksSelector;
  const paginationSelector = workUaSelectors.paginationSelector;

  if (index >= links.length) {
    console.log('All links processed at workUa.');
    let lastData = JSON.parse(fs.readFileSync('searchResult.json'));
    await spamScriptWorkUa(lastData);
    return;
  }
  const filteredJobsLink = links[index];

  const { page, browser } = await startBrowser();

  await page.goto(filteredJobsLink);

  await scrollDown(page);

  const pages = await page.$$(paginationSelector);
  pages.shift();

  let vacancies = await getJobLinks(page, jobLinksSelector);

  for (let i = 0; i < pages.length; i++) {
    await nextPage(filteredJobsLink, page);
    await scrollDown(page);

    let nextVacancies = await getJobLinks(page, jobLinksSelector);
    vacancies = vacancies.concat(nextVacancies);
    lastData = vacancies;
  }

  writeLinks(vacancies);

  await browser.close();
  await parseJobLinksWorkUa(links, index + 1);
}

module.exports = { parseJobLinksWorkUa };
