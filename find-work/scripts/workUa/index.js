const parseBack = require('./parse/parseJuniorBackEnd');
const parseFront = require('./parse/parseJuniorFront');
const parseFull = require('./parse/parseJuniorFullStack');
const { parseJobLinksWorkUa } = require('./parse/parseJobLinksWorkUa');
const { spamScriptWorkUa } = require('./spam/spamScriptWorkUa');
const spamFull = require('./spam/spamJuniorBackEnd');
const spamBack = require('./spam/spamJuniorFront');
const spamFront = require('./spam/spamJuniorFullStack');

module.exports = {
  parseBack,
  parseFront,
  parseFull,
  spamFull,
  spamBack,
  spamFront,
  parseJobLinksWorkUa,
  spamScriptWorkUa,
};
