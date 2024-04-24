const fs = require('fs');
const { scrollDown, getJobLinksFromField } = require('../../../helpers');
const { spamScriptNFJ } = require('../spam/spamScriptNFJ');
const { startBrowser } = require('../../../utils');

async function parseJobLinksNFJ(links, index) {
  const fieldToSearch =
    'nfj-postings-search > div > div > common-main-loader > div > nfj-search-results > nfj-postings-list > div.list-container.ng-star-inserted';
  const jobLinksSelector = 'div.list-container.ng-star-inserted > a';

  if (index >= links.length) {
    console.log('All links processed at NFJ.');
    let lastData = JSON.parse(fs.readFileSync('searchResultNFJ.json'));
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

  let existingData = JSON.parse(fs.readFileSync('searchResultNFJ.json'));
  let newData = existingData.concat(vacancies);
  fs.writeFileSync('searchResultNFJ.json', JSON.stringify(newData));

  await browser.close();
  await parseJobLinksNFJ(links, index + 1);
}

module.exports = { parseJobLinksNFJ };
