const puppeteer = require('puppeteer');
const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const {
  checkVacancyRabotaUa,
  isDocumentExsist,
  checkVacancyRabotaUaBack,
  checkVacancyBadConditions,
} = require('../../../helpers');
const { sleep } = require('../../../utils');

async function spamScriptRabotaUA(lastData) {
  const mainVacancySelector =
    'alliance-jobseeker-vacancy-page > article > div > div > div';
  const createApplySelector =
    'div > div > lib-top-bar > div > div > santa-button > button';
  const letterCheckBoxSelector = 'alliance-apply-cover-letter';
  const letterTextAriaSelector =
    'alliance-apply-page > main > div > div > alliance-apply-cover-letter > textarea';
  const applyButtonSelector =
    'alliance-apply-action-buttons > div > santa-button-spinner > div > santa-button > button';

  let linksArray = lastData.slice();
  let appliedVac = await isDocumentExsist(sended, 'appliedVacancies.json');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: './tmp',
  });
  const page = await browser.newPage();

  for (let i = 0; i < linksArray.length; i++) {
    if (!appliedVac.includes(linksArray[i])) {
      const random = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;

      await page.goto(linksArray[i]);

      await sleep(random);

      await page.waitForSelector(createApplySelector, { visible: true });
      await page.waitForSelector('body');

      const conditions = await checkVacancyRabotaUa(page, mainVacancySelector);
      const badConditions = await checkVacancyBadConditions(
        page,
        mainVacancySelector
      );
      const backend = await checkVacancyRabotaUaBack(page, mainVacancySelector);

      if ((conditions && !badConditions) || (backend && !badConditions)) {
        await page.click(createApplySelector);
        await sleep(random);

        await page.waitForSelector(letterCheckBoxSelector);

        await page.click(letterCheckBoxSelector);

        await page.waitForSelector(letterTextAriaSelector);
        const letter = letters.fullStackLetter;
        await page.type(letterTextAriaSelector, letter);
        await sleep(random);
        await page.waitForSelector(applyButtonSelector, { visible: true });
        await page.click(applyButtonSelector);
        await sleep(random);
        appliedVac.push(linksArray[i]);

        let uniqueData = Array.from(new Set(appliedVac));
        fs.writeFileSync('appliedVacancies.json', JSON.stringify(uniqueData));
      }
    }
  }

  await browser.close();
}

module.exports = { spamScriptRabotaUA };
