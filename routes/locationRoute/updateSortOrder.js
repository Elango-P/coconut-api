const LocationService = require("../../services/LocationService");


const updateSortOrder=async (req, res, next)=> {
  try{
    await LocationService.updateSortOrder(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = updateSortOrder;