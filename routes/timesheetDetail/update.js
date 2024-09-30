const TimeSheetDetailService = require("../../services/TimeSheetDetailService");


async function update(req, res, next) {
  try{
    TimeSheetDetailService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;