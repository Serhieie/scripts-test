const fs = require('fs');
const {
  scrollDown,
  getJobLinksFromField,
  writeLinks,
} = require('../../../helpers');
const { spamScriptNFJ } = require('../spam/spamScriptNFJ');
const { startBrowser } = require('../../../utils');
const selectors = require('../../selectors.json');
const nfjSelectors = selectors.nfj;

async function parseJobLinksNFJ(links, index) {
  const fieldToSearch = nfjSelectors.fieldToSearch;
  const jobLinksSelector = nfjSelectors.jobLinksSelector;

  if (index >= links.length) {
    console.log('All links processed at NFJ.');
    let lastData = JSON.parse(fs.readFileSync('searchResult.json'));
    await spamScriptNFJ(lastData);
    return;
  }
  const filteredJobsLink = links[index];

  const { page, browser } = await startBrowser();

  await page.goto(filteredJobsLink);
  await scrollDown(page);

  let vacancies = await getJobLinksFromField(
    page,
    fieldToSearch,
    jobLinksSelector
  );

  writeLinks(vacancies);

  await browser.close();
  await parseJobLinksNFJ(links, index + 1);
}

module.exports = { parseJobLinksNFJ };
