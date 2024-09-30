const HolidayService = require("../../services/HolidayService")

const get=async (req,res,next)=>{
    await HolidayService.get(req,res,next);
}
module.exports = get;