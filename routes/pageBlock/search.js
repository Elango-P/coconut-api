const PageBlockService = require("../../services/PageBlockService");


const search =async (req,res,next)=>{
    let companyId = Request.GetCompanyId(req);

    let data = await PageBlockService.search(companyId);
    res.json(200, { data: data })

}
module.exports =search;