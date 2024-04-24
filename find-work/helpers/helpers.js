const fs = require('fs');

async function scrollDown(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 300;

      const scrollInterval = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 100);
    });
  });
}

async function getJobLinks(page, selector) {
  let jobs = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector)).map(a => a.href);
  }, selector);
  return jobs;
}

async function getJobLinksFromField(page, fieldSelector, linkSelector) {
  let jobs = await page.evaluate(
    (fieldSelector, linkSelector) => {
      const field = document.querySelector(fieldSelector);
      if (!field) return [];
      return Array.from(field.querySelectorAll(linkSelector)).map(a => a.href);
    },
    fieldSelector,
    linkSelector
  );
  return jobs;
}

async function nextPage(base, page) {
  const nextPageNumber = await page.evaluate(() => {
    const currentPageNumberElement = document.querySelector(
      '.pagination .active span'
    );
    if (
      !currentPageNumberElement ||
      !currentPageNumberElement.textContent.trim()
    ) {
      return null;
    }
    const currentPageNumber = parseInt(
      currentPageNumberElement.textContent.trim()
    );
    return currentPageNumber + 1;
  });
  if (nextPageNumber !== null) {
    const nextPageURL = `${base}?page=${nextPageNumber}`;
    await page.goto(nextPageURL);
  } else {
    console.log(
      'No next page found or current page number is empty. Exiting nextPage function.'
    );
  }
}

async function checkVacancyConditions(page, sel, searchTerms, action = true) {
  const conditions = await page.evaluate(
    (sel, searchTerms, action) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      const bodyText = element.innerText;
      return action
        ? searchTerms.every(term => bodyText.includes(term))
        : searchTerms.some(term => bodyText.includes(term));
    },
    sel,
    searchTerms,
    action
  );
  return conditions;
}

async function checkVacancyWorkUaNFJ(page, sel) {
  const searchTerms = ['Дистанційна робота', 'React'];
  return await checkVacancyConditions(page, sel, searchTerms);
}

async function checkVacancyWorkUaBackNFJ(page, sel) {
  const searchTerms = ['Дистанційна робота', 'Node.js'];
  return await checkVacancyConditions(page, sel, searchTerms);
}

async function checkVacancyRabotaUa(page, sel) {
  const searchTerms = ['Віддалена робота', 'React'];
  return await checkVacancyConditions(page, sel, searchTerms);
}

async function checkVacancyRabotaUaBack(page, sel) {
  const searchTerms = ['Віддалена робота', 'Node.js'];
  return await checkVacancyConditions(page, sel, searchTerms);
}

async function checkVacancyBadConditions(page, sel) {
  const searchTerms = [
    'Senior Front',
    'Senior Back',
    'Senior Full',
    'Senior FrontEnd',
    'Senior BackEnd',
    'Senior FullStack',
    'Senior Front-End',
    'Senior Back-End',
    'Senior Full-Stack',
    'senior FrontEnd',
    'senior BackEnd',
    'senior FullStack',
    'senior Front-End',
    'senior Back-End',
    'senior Full-Stack',
    '.NET',
    '(.NET',
    '(.NET/',
    'PHP',
    '(PHP',
    '(PHP/',
    'React Native',
    'React native',
    'react native',
    'Team Lead',
    'Team Lead Front',
    'Team Lead Back',
    'Team Lead Full',
    'team lead',
    'Team Lead FrontEnd',
    'Team Lead BackEnd',
    'Team Lead FullStack',
    'Team Lead Front-End',
    'Team Lead Back-End',
    'Team Lead Full-Stack',
    'Python',
    'python',
    '(Python',
    '(Python/',
    'Angular',
    'angular',
    '(Angular',
    '(Angular/',
    'WordPress',
    'Wordpress',
    '(Wordpress',
    '(Wordpress/',
    '(WordPress',
    '(WordPress/',
  ];
  return await checkVacancyConditions(page, sel, searchTerms, false);
}

async function isDocumentExsist(searchResult, docName) {
  const links = Object.values(searchResult);
  let linksArray = links.slice();

  if (fs.existsSync(searchResult)) {
    try {
      const data = fs.readFileSync(searchResult, 'utf8');
      linksArray = JSON.parse(data);
    } catch (err) {
      console.error(`Error reading ${docName}:`, err);
    }
  }

  return linksArray;
}

module.exports = {
  scrollDown,
  getJobLinks,
  nextPage,
  checkVacancyWorkUaNFJ,
  getJobLinks,
  isDocumentExsist,
  checkVacancyRabotaUa,
  checkVacancyWorkUaBackNFJ,
  checkVacancyRabotaUaBack,
  checkVacancyBadConditions,
  getJobLinksFromField,
};
