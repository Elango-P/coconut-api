const HolidayService = require("../../services/HolidayService")

const search = async (req, res, next) => {
  await HolidayService.search(req, res, next);
}
module.exports = search;