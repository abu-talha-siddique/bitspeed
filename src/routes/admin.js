const { Router } = require('express');
const { adminController } = require('../controllers/adminController');

const adminRouter = Router();

// Get all contacts
adminRouter.get('/contacts', (req, res) => adminController.getAllContacts(req, res));

// Clear all contacts
adminRouter.delete('/contacts', (req, res) => adminController.clearAllContacts(req, res));

// Delete specific contact
adminRouter.delete('/contacts/:id', (req, res) => adminController.deleteContact(req, res));

module.exports = { adminRouter };
