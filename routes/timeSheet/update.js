
const TimeSheetService = require("../../services/TimeSheetService");

async function update(req, res, next) {
  try{
    TimeSheetService.update(req, res, next)
} catch(err){
    console.log(err);
}
};

module.exports = update;