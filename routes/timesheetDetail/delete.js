const TimeSheetDetailService = require("../../services/TimeSheetDetailService");


async function del(req, res, next) {
  try{
    TimeSheetDetailService.delete(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;