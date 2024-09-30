const HolidayService = require("../../services/HolidayService")

const update=async (req,res,next)=>{
    await HolidayService.update(req,res,next);
}
module.exports = update;