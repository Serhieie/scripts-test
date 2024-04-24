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

async function getJobLinks(page) {
  let jobs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        '#pjax-jobs-list > .card-search div.add-bottom > h2 > a'
      )
    ).map(a => a.href)
  );
  return jobs;
}

async function getJobLinksRabotaUa(page) {
  let jobs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        'alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a'
      )
    ).map(a => a.href)
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

async function checkVacancyWorkUa(page, sel) {
  const searchTerms = ['Дистанційна робота', 'React'];
  return await checkVacancyConditions(page, sel, searchTerms);
}

async function checkVacancyWorkUaBack(page, sel) {
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
    'Senior',
    'Senior Front',
    'Senior Back',
    'Senior Full',
    '.NET',
    '(.NET',
    '(.NET/',
    'PHP',
    '(PHP',
    '(PHP/',
    'Team Lead',
    'Team Lead Front',
    'Team Lead Back',
    'Team Lead Full',
    'team lead',
    'Python',
    'python',
    '(Python',
    '(Python/',
    'Angular',
    'angular',
    '(Angular',
    '(Angular/',
  ];
  return await checkVacancyConditions(page, sel, searchTerms, false);
}

async function isSearchResultExist(searchResult) {
  const links = Object.values(searchResult);
  let linksArray = links.slice();

  if (fs.existsSync(searchResult)) {
    try {
      const data = fs.readFileSync(searchResult, 'utf8');
      linksArray = JSON.parse(data);
    } catch (err) {
      console.error('Error reading searchResult.json:', err);
    }
  }

  return linksArray;
}

async function isAppliedVacanciesExist(sended) {
  const applied = Object.values(sended);
  let appliedVac = applied.slice();

  if (fs.existsSync(sended)) {
    try {
      const data = fs.readFileSync(sended, 'utf8');
      appliedVac = JSON.parse(data);
    } catch (err) {
      console.error('Error reading appliedVacancies.json:', err);
    }
  }
  return appliedVac;
}

module.exports = {
  scrollDown,
  getJobLinks,
  nextPage,
  checkVacancyWorkUa,
  isAppliedVacanciesExist,
  isSearchResultExist,
  getJobLinksRabotaUa,
  checkVacancyRabotaUa,
  checkVacancyWorkUaBack,
  checkVacancyRabotaUaBack,
  checkVacancyBadConditions,
};
