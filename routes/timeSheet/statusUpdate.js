const TimeSheetService = require("../../services/TimeSheetService");


async function statusUpdate(req, res, next) {
  try{
    TimeSheetService.statusUpdate(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = statusUpdate;