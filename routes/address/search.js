
const AddressService = require("../../services/AddressService");

async function search(req, res, next) {
  try{
    AddressService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;