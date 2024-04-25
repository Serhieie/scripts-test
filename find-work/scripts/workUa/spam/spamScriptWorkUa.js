const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const { sleep, random, startBrowser } = require('../../../utils');
const {
  checkVacancyWorkUaNFJ,
  isDocumentExsist,
  checkVacancyWorkUaBackNFJ,
  checkVacancyBadConditions,
} = require('../../../helpers');
const selectors = require('../../selectors.json');

const workUaSelectors = selectors.workUa;

async function spamScriptWorkUa(links) {
  const mainVacancySelector = workUaSelectors.mainVacancySelector;
  const createApplySelector = workUaSelectors.createApplySelector;
  const choseCVSelector = workUaSelectors.choseCVSelector;
  const letterCheckBoxSelector = workUaSelectors.letterCheckBoxSelector;
  const letterTextAriaSelector = workUaSelectors.letterTextAriaSelector;
  const applyButtonSelector = workUaSelectors.applyButtonSelector;

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
}

module.exports = { spamScriptWorkUa };
