
const Request = require("../../lib/request");
const ValidationService = require("../../services/ValidationService");

const ValidateSalesSettlementOnAdd = (req, res,next) => {
    const companyId = Request.GetCompanyId(req);
    const userId = Request.getUserId(req);
    const roleId = Request.getUserRole(req);
    try {
        ValidationService.salesSettlementValidationOnAdd(userId,roleId,companyId,res);
       
    } catch (err) {
        console.log(err);
        res.json(400, { message: err.message });
    }
};

module.exports = ValidateSalesSettlementOnAdd;
