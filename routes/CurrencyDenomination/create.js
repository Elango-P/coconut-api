const ObjectName = require("../../helpers/ObjectName");
const Number = require("../../lib/Number");
const CurrencyDenominationService = require("../../services/CurrencyDenominationService");
const history = require("../../services/HistoryService");


const create =async (req,res,next)=>{
    let companyId = Request.GetCompanyId(req);

    if (!companyId) {
        return res.json(400, { message: "CompanyId Not Found" })
    }
    

    let data  = req.body;
    let createData={
        ...data,
        company_id: companyId,
        amount: Number.Multiply(data?.denomination, data?.count)
    }
     await CurrencyDenominationService.create(createData).then((response)=>{

         res.json(200, {
            message: "Currency Denomination Created",
        });
        res.on("finish", async () => {
            history.create("Currency Denomination Created", req, ObjectName.SALE_SETTLEMENT, response?.id);
        });
     })
}
module.exports =create;