const TimeSheetDetailService = require("../../services/TimeSheetDetailService");


async function search(req, res, next) {
  try{
    TimeSheetDetailService.search(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = search;