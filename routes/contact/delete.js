// Service dependencies
const contactService = require('../../services/ContactService');

// Contact Delete route
async function del(req, res) {
  try {
    // connect to delete route service
    contactService.del(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// Export contact delete function
module.exports = del;
