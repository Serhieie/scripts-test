const puppeteer = require('puppeteer');
const fs = require('fs');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const { sleep } = require('../../../utils');
const {
  checkVacancyWorkUa,
  isAppliedVacanciesExist,
  checkVacancyWorkUaBack,
  checkVacancyBadConditions,
} = require('../../../helpers');

//node ./scripts/workUa/spam/spam.js

async function spamScriptWorkUa(links) {
  let linksArray = links.slice();
  let appliedVac = await isAppliedVacanciesExist(sended);

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

      await page.waitForSelector(
        'div > div > div > div > div > div.pull-left > div > div > a',
        { visible: true }
      );
      await page.waitForSelector('body');

      const mainVacancySelector =
        '#center > div > div.row.row-print > div.col-md-8 > div.card.card-spell-wrapper > div:nth-child(2)';
      const conditions = await checkVacancyWorkUa(page, mainVacancySelector);
      const backend = await checkVacancyWorkUaBack(page, mainVacancySelector);
      const badConditions = await checkVacancyBadConditions(
        page,
        mainVacancySelector
      );

      if ((conditions && !badConditions) || (backend && !badConditions)) {
        await page.click(
          'div > div > div > div > div > div.pull-left > div > div > a'
        );
        await sleep(random);

        await page.waitForSelector(
          '#savedresume > div:nth-child(2) > div:nth-child(3) > label',
          { visible: true }
        );
        await page.click(
          '#savedresume > div:nth-child(2) > div:nth-child(3) > label'
        );
        await page.click('#commonresume > div:nth-child(1) > div > label');

        const letter = letters.fullStackLetter;

        await page.type('#addtext', letter);

        await sleep(random);
        await page.waitForSelector('#submitbtn', { visible: true });
        await page.click('#submitbtn');
        await sleep(random);
        appliedVac.push(linksArray[i]);

        let uniqueData = Array.from(new Set(appliedVac));
        fs.writeFileSync('appliedVacancies.json', JSON.stringify(uniqueData));
      }
    }
  }

  await browser.close();
}

module.exports = { spamScriptWorkUa };
