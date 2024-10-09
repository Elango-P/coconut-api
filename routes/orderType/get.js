const OrderTypeService = require("../../services/OrderTypeService");

async function Get(req, res, next) {
    const { id } = req.params;
    const company_id = Request.GetCompanyId(req);

   let data =  await OrderTypeService.get(id, company_id);
    res.json(200, data);

}

module.exports = Get;
