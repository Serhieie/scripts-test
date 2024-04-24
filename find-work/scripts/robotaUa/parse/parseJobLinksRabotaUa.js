const fs = require('fs');
const { scrollDown, getJobLinks } = require('../../../helpers');
const { spamScriptRobotaUA } = require('../spam/spamScriptRabotaUA');
const { startBrowser } = require('../../../utils');

async function parseJobLinksRabotaUa(links, index) {
  const jobLinkSelector =
    'alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a';
  const paginationSelector = 'santa-pagination-with-links > div > a';
  if (index >= links.length) {
    console.log('All links processed at RabotaUa.');
    let lastData = JSON.parse(fs.readFileSync('searchResultRobotaUa.json'));
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

  let existingData = JSON.parse(fs.readFileSync('searchResultRobotaUa.json'));
  let newData = existingData.concat(vacancies);
  fs.writeFileSync('searchResultRobotaUa.json', JSON.stringify(newData));

  await browser.close();
  await parseJobLinksRabotaUa(links, index + 1);
}

module.exports = { parseJobLinksRabotaUa };
