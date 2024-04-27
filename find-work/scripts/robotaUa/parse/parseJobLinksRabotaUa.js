const fs = require('fs');
const { scrollDown, getJobLinks, writeLinks } = require('../../../helpers');
const { spamScriptRobotaUA } = require('../spam/spamScriptRabotaUA');
const { startBrowser } = require('../../../utils');
const selectors = require('../../selectors.json');

const robotaUaSelectors = selectors.robotaUa;

async function parseJobLinksRabotaUa(links, index) {
  const jobLinkSelector = robotaUaSelectors.jobLinkSelector;
  const paginationSelector = robotaUaSelectors.paginationSelector;

  if (index >= links.length) {
    console.log('All links processed at RabotaUa.');
    let lastData = JSON.parse(fs.readFileSync('searchResult.json'));
    await spamScriptRobotaUA(lastData);
    return;
  }

  const filteredJobsLinc = links[index];

  const { page, browser } = await startBrowser();

  // Navigate the page to a URL
  await page.goto(filteredJobsLinc);

  //scroll down
  await scrollDown(page);

  const pages = await page.$$(paginationSelector);
  pages.shift();

  let vacancies = await getJobLinks(page, jobLinkSelector);

  for (const page of pages) {
    await page.click();
    await scrollDown(page);
    let nextVacancies = await getJobLinks(page, jobLinkSelector);
    vacancies = vacancies.concat(nextVacancies);
  }

  writeLinks(vacancies);

  await browser.close();
  await parseJobLinksRabotaUa(links, index + 1);
}

module.exports = { parseJobLinksRabotaUa };
