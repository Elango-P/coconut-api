
const TimeSheetService = require("../../services/TimeSheetService");

async function search(req, res, next) {
  try{
    TimeSheetService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;