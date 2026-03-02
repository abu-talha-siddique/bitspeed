const { Router } = require('express');
const { identifyController } = require('../controllers/identifyController');

const identifyRouter = Router();

identifyRouter.post('/identify', (req, res) => identifyController.identify(req, res));

module.exports = { identifyRouter };
