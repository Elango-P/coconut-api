// Service dependencies
const contactService = require('../../services/ContactService');

async function update(req, res, next) {
  //  Contact update route
  try {
    contactService.update(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// Export update route function
module.exports = update;
