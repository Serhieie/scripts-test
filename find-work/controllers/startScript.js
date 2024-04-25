const { parseJobLinksRabotaUa } = require('../scripts/robotaUa');
const { parseJobLinksWorkUa } = require('../scripts/workUa');
const { parseJobLinksNFJ } = require('../scripts/nfj');
const { ctrlWrapper } = require('../helpersBack');
const links = require('../scripts/selectors.json');

const start = async (req, res) => {
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
};

module.exports = {
  start: ctrlWrapper(start),
};
