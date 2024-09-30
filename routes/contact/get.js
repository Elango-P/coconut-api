// service dependencies
const contactService = require('../../services/ContactService');

async function get(req, res) {
  //  Connect to Get route services
  try {
    contactService.get(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// Export contact get function
module.exports = get;
