
const objectService = require("../../services/ObjectService");

async function search(req, res, next) {
  try{
    objectService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;