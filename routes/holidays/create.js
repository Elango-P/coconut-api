const HolidayService = require("../../services/HolidayService");

const create=async (req,res,next)=>{
    await HolidayService.create(req,res,next);
}
module.exports = create;