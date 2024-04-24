const { parseJobLinksRabotaUa } = require('./robotaUa');
const { parseJobLinksWorkUa } = require('./workUa');
const { parseJobLinksNFJ } = require('./nfj');
const find = require('./jobLinks');

//node ./scripts/searchWork.js

parseJobLinksRabotaUa(find.jobLinksRabotaUa, 0)
  .then(async () => {
    console.log('First script completed.');
    await parseJobLinksWorkUa(find.jobLinksWorkUa, 0);
  })
  .then(async () => {
    console.log('Second script completed.');
    await parseJobLinksNFJ(find.jobLinksNFJ, 0);
  })
  .catch(error => {
    console.error('Error occurred in the first script:', error);
  });
