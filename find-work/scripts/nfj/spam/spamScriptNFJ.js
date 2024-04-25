const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const { sleep, random } = require('../../../utils');
const { startBrowser } = require('../../../utils');
const {
  checkVacancyWorkUaNFJ,
  isDocumentExsist,
  checkVacancyWorkUaBackNFJ,
  checkVacancyBadConditions,
} = require('../../../helpers');
require('dotenv').config();
const selectors = require('../../selectors.json');

const nfjSelectors = selectors.nfj;
const { LINKEDIN, GITHUB } = process.env;

async function spamScriptNFJ(links) {
  const mainVacancySelector = nfjSelectors.mainVacancySelector;
  const createApplySelector = nfjSelectors.createApplySelector;
  const languageSelector = nfjSelectors.languageSelector;
  const optionalSelectors = nfjSelectors.optionalSelectors;
  const letterTextAriaSelector = nfjSelectors.letterTextAriaSelector;
  const saveOptionalSelector = nfjSelectors.saveOptionalSelector;
  const optionalInputsSelector = nfjSelectors.optionalInputsSelector;
  const applyButtonSelector = nfjSelectors.applyButtonSelector;

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

        await page.waitForSelector(languageSelector);
        const languageElement = await page.$(languageSelector);
        if (languageElement) {
          await languageElement.click();
        }
        await sleep(time);

        const optionalElements = await page.$$(optionalSelectors);
        for (const j = 0; j < optionalElements.length; j++) {
          if (j === 0) {
            await optionalElements[j].click();
            const letter = letters.fullStackLetter;
            await page.type(letterTextAriaSelector, letter);
            await page.click(saveOptionalSelector);
          } else if (j === 1) {
            await optionalElements[j].click();
            const linkedin = LINKEDIN;
            await page.type(optionalInputsSelector, linkedin);
            await page.click(saveOptionalSelector);
          } else if (j === 2) {
            await optionalElements[j].click();
            const github = GITHUB;
            await page.type(optionalInputsSelector, github);
            await page.click(saveOptionalSelector);
          }
          await sleep(time);
        }

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

module.exports = { spamScriptNFJ };
