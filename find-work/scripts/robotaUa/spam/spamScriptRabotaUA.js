const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const {
  checkVacancyRabotaUa,
  isDocumentExsist,
  checkVacancyRabotaUaBack,
  checkVacancyBadConditions,
  finalMessage,
} = require('../../../helpers');
const { sleep, random, startBrowser } = require('../../../utils');
const selectors = require('../../selectors.json');

const robotaUaSelectors = selectors.robotaUa;

async function spamScriptRobotaUA(lastData) {
  console.log(`Was founded ${lastData.length} links.`);

  const appliedVacanciesAtThisRound = [];
  const mainVacancySelector = robotaUaSelectors.mainVacancySelector;
  const createApplySelector = robotaUaSelectors.createApplySelector;
  const letterCheckBoxSelector = robotaUaSelectors.letterCheckBoxSelector;
  const letterTextAriaSelector = robotaUaSelectors.letterTextAriaSelector;
  const applyButtonSelector = robotaUaSelectors.applyButtonSelector;

  let linksArray = lastData.slice();
  let appliedVac = await isDocumentExsist(sended, 'appliedVacancies.json');

  const { page, browser } = await startBrowser();

  for (let i = 0; i < linksArray.length; i++) {
    if (!appliedVac.includes(linksArray[i])) {
      const time = random();

      await page.goto(linksArray[i]);
      await sleep(time);

      await page.waitForSelector(createApplySelector, { visible: true });

      const conditions = await checkVacancyRabotaUa(page, mainVacancySelector);
      const badConditions = await checkVacancyBadConditions(
        page,
        mainVacancySelector
      );
      const backend = await checkVacancyRabotaUaBack(page, mainVacancySelector);

      if ((conditions && !badConditions) || (backend && !badConditions)) {
        await page.click(createApplySelector);
        await sleep(time);

        await page.waitForSelector(letterCheckBoxSelector);
        await page.click(letterCheckBoxSelector);
        await page.waitForSelector(letterTextAriaSelector);

        const letter = letters.fullStackLetter;
        await page.type(letterTextAriaSelector, letter);
        await sleep(time);

        await page.waitForSelector(applyButtonSelector);
        await page.click(applyButtonSelector);
        await sleep(time);

        appliedVac.push(linksArray[i]);
        appliedVacanciesAtThisRound.push(linksArray[i]);

        let uniqueData = Array.from(new Set(appliedVac));
        fs.writeFileSync('appliedVacancies.json', JSON.stringify(uniqueData));
      }
    }
  }

  finalMessage(appliedVacanciesAtThisRound);
  await browser.close();

  fs.writeFileSync('searchResult.json', '[]');
}

module.exports = { spamScriptRobotaUA };
