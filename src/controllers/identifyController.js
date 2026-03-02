const { identifyService } = require('../services/identifyService');

class IdentifyController {
  async identify(req, res) {
    try {
      const { email, phoneNumber } = req.body;

      // Validation
      if (!email && !phoneNumber) {
        res.status(400).json({ 
          error: 'Either email or phoneNumber must be provided' 
        });
        return;
      }

      const result = await identifyService.identify({ email, phoneNumber });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in identify endpoint:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      });
    }
  }
}

const identifyController = new IdentifyController();

module.exports = { identifyController };
