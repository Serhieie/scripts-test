const { parseJobLinksRabotaUa } = require('./robotaUa');
const { parseJobLinksWorkUa } = require('./workUa');
const { parseJobLinksNFJ } = require('./nfj');
const links = require('./selectors.json');

//node ./scripts/searchWork.js

parseJobLinksRabotaUa(links.robotaUa.links, 0)
  .then(async () => {
    console.log('First script completed.');
    await parseJobLinksWorkUa(links.workUa.links, 0);
  })
  .then(async () => {
    console.log('Second script completed.');
    await parseJobLinksNFJ(links.nfj.links, 0);
  })
  .catch(error => {
    console.error('Error occurred in the first script:', error);
  });
