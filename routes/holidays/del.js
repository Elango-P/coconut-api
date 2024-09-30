const HolidayService = require("../../services/HolidayService")


const del=async (req,res,next)=>{
    await HolidayService.del(req,res,next);
}
module.exports = del;