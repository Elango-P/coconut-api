

const AddressService = require("../../services/AddressService");

async function update (req, res, next) {
  try{
    AddressService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update