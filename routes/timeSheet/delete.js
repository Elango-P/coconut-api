
const TimeSheetService = require("../../services/TimeSheetService");

async function del(req, res, next) {
  try{
    TimeSheetService.delete(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = del;