
const AddressService = require("../../services/AddressService");

async function del (req, res, next) {
  try{
    AddressService.del(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del