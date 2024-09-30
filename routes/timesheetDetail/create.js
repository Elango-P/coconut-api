const TimeSheetDetailService = require("../../services/TimeSheetDetailService");


async function create(req, res, next) {
  try{
    TimeSheetDetailService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;