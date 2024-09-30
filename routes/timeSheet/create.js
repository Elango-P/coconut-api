
const TimeSheetService = require("../../services/TimeSheetService");

async function create(req, res, next) {
  try{
    TimeSheetService.create(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = create;