
const addressService = require("../../services/AddressService");

async function create(req, res, next) {
  try{
    addressService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;