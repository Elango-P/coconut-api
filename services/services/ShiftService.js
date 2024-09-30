const DataBaseService = require("../../lib/dataBaseService");

const { Shift } = require("../../db").models;
const shiftService = new DataBaseService(Shift);

class ShiftService {
  
  static async getName(id, companyId) {
    try {
      if (!id) {
        return null;
      }
      const shiftData = await shiftService.findOne({
        where: { id: id, company_id: companyId },
      });
      return shiftData?.name;
    } catch (err) {
      console.log(err);
    }
  }


}

module.exports = ShiftService;
