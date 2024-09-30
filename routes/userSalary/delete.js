const Request = require("../../lib/request");
const { UserSalary } = require('../../db').models;

const del = async (req, res) => {
    try {
      // get UserSalary Id from request
      let userSalaryId = req.params.id;

      // get company Id from request
      const companyId = Request.GetCompanyId(req);
  
      // validate UserSalary Id exist or not
      if (!userSalaryId) {
        return res.json(400, { message: "UserSalary Id is required" });
      }
  
      // delete UserSalary entry
      await UserSalary.destroy({ where: { id: userSalaryId, company_id: companyId } });
  
      res.json(200, { message: "UserSalary Deleted" });
    } catch (err) {
        console.log(err);
      return res.json(400, { message: err.message });
    }
  };

  module.exports = del;
  