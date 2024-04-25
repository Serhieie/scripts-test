const express = require('express');
const ctrl = require('../../controllers/startScript');

const router = express.Router();

// const { validateBody, autenticate } = require('../../middlewares');
// const { schemas } = require('../../models/asset');

router.post('/', ctrl.start);

module.exports = router;
