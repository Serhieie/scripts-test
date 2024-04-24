const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const { sleep, random, startBrowser } = require('../../../utils');
// const { parseJobLinksNFJ } = require('../../nfj');
// const find = require('../../jobLinks');
const {
  checkVacancyWorkUaNFJ,
  isDocumentExsist,
  checkVacancyWorkUaBackNFJ,
  checkVacancyBadConditions,
} = require('../../../helpers');

async function spamScriptWorkUa(links) {
  const mainVacancySelector =
    '#center > div > div.row.row-print > div.col-md-8 > div.card.card-spell-wrapper > div:nth-child(2)';
  const createApplySelector =
    'div > div > div > div > div > div.pull-left > div > div > a';
  const choseCVSelector =
    '#savedresume > div:nth-child(2) > div:nth-child(3) > label';
  const letterCheckBoxSelector =
    '#commonresume > div:nth-child(1) > div > label';
  const letterTextAriaSelector = '#addtext';
  const applyButtonSelector = '#submitbtn';

  let linksArray = links.slice();
  let appliedVac = await isDocumentExsist(sended, 'appliedVacancies.json');

  const { page, browser } = await startBrowser();

  for (let i = 0; i < linksArray.length; i++) {
    if (!appliedVac.includes(linksArray[i])) {
      const time = random();

      await page.goto(linksArray[i]);
      await sleep(time);

      await page.waitForSelector(createApplySelector, { visible: true });

      const conditions = await checkVacancyWorkUaNFJ(page, mainVacancySelector);
      const backend = await checkVacancyWorkUaBackNFJ(
        page,
        mainVacancySelector
      );
      const badConditions = await checkVacancyBadConditions(
        page,
        mainVacancySelector
      );

      if ((conditions && !badConditions) || (backend && !badConditions)) {
        await page.click(createApplySelector);
        await sleep(time);

        await page.waitForSelector(choseCVSelector);
        await page.click(choseCVSelector);
        await page.click(letterCheckBoxSelector);

        const letter = letters.fullStackLetter;
        await page.type(letterTextAriaSelector, letter);
        await sleep(time);

        await page.waitForSelector(applyButtonSelector);
        await page.click(applyButtonSelector);
        await sleep(time);

        appliedVac.push(linksArray[i]);

        let uniqueData = Array.from(new Set(appliedVac));
        fs.writeFileSync('appliedVacancies.json', JSON.stringify(uniqueData));
      }
    }
  }

  await browser.close();
  // await parseJobLinksNFJ(find.jobLinksNFJ, 0);
}

module.exports = { spamScriptWorkUa };
