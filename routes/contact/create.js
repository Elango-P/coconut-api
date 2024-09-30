// Service dependencies
const contactService = require('../../services/ContactService');

async function create(req, res) {
  //  connect to create route service
  try {
    contactService.create(req, res);
  } catch (err) {
    // Error Handling
    console.log(err);
  }
}
// export contact create function
module.exports = create;
