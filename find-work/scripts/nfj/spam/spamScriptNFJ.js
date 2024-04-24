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

const { LINKEDIN, GITHUB } = process.env;

async function spamScriptNFJ(links) {
  const mainVacancySelector = 'div.border.ng-star-inserted';
  const createApplySelector = '#applyButton';
  const languageSelector = 'nfj-apply-known-languages > nfj-checkbox';
  const optionalSelectors =
    'nfj-apply-internal-step-application > form > nfj-apply-optional > div';
  const letterTextAriaSelector = 'div > textarea';
  const saveOptionalSelector =
    'button.tw-btn.tw-btn-primary.tw-btn-lg.tw-truncate';
  const optionalInputsSelector =
    'common-material-modal > div.dialog-body > section > nfj-form-field > div > div > input';
  const applyButtonSelector = '#sendApplicationButton > button';

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
        if (languageSelector) {
          await page.click(languageSelector);
        }

        const optionalElements = await page.$$(optionalSelectors);
        for (const i = 0; i < optionalElements.length; i++) {
          if (i === 0) {
            await optionalElements[i].click();
            const letter = letters.fullStackLetter;
            await page.type(letterTextAriaSelector, letter);
            await page.click(saveOptionalSelector);
          } else if (i === 1) {
            await optionalElements[i].click();
            const linkedin = LINKEDIN;
            await page.type(optionalInputsSelector, linkedin);
            await page.click(saveOptionalSelector);
          } else if (i === 2) {
            await optionalElements[i].click();
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
