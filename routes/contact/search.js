// module dependencies
const contactService = require('../../services/ContactService');

// Contact search route
async function search(req, res) {
  try {
    // Get search query from request body
    contactService.search(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// Export contact search function
module.exports = search;
