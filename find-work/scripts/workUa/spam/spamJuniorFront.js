const puppeteer = require('puppeteer');
const fs = require('fs');
const searchResult = require('../../../searchResultWorkUa.json');
const sended = require('../../../appliedVacancies.json');
const letters = require('../../../letters/letters.json');
const { sleep } = require('../../../utils');
const {
  checkVacancyWorkUa,
  isAppliedVacanciesExist,
} = require('../../../helpers');

//node ./scripts/workUa/spam/spamJuniorFront.js

(async () => {
  const links = Object.values(searchResult);
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
      const random =
        (Math.floor(Math.random() * 8) * (Math.random() * 2) + 1) * 1000;
      await page.goto(linksArray[i]);
      await sleep(random);

      await page.waitForSelector(
        'div > div > div > div > div > div.pull-left > div > div > a',
        { visible: true }
      );
      await page.waitForSelector('body');

      const conditions = await checkVacancyWorkUa(page);
      // const fullFrontBack = await checkWhoNeeds(page);

      if (conditions) {
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

        await page.evaluate(letter => {
          const element = document.querySelector('#addtext');
          if (element) {
            element.textContent = letter;
          } else {
            console.log('Element not found.');
          }
        }, letter);
        await sleep(random);

        await page.waitForSelector('#submitbtn', { visible: true });
        await page.click('#submitbtn');
        await sleep(random);
        appliedVac.push(linksArray[i]);

        try {
          fs.writeFileSync(
            'appliedVacancies.json',
            JSON.stringify(appliedVac),
            'utf8'
          );
          console.log('Новий запис додано до файлу appliedVacancies.json.');
        } catch (err) {
          console.error('Помилка запису в файл appliedVacancies.json:', err);
        }
      }

      linksArray.shift();
      let result = JSON.stringify(linksArray);

      fs.writeFile('searchResultJuniorFront.json', result, function (err) {
        if (err) throw new Error(err);
      });
    }
  }

  await browser.close();
})();
