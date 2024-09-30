
const Request = require("../../lib/request");
const AddressService = require("../../services/AddressService");

async function get(req, res, next) {
  try{
    const id = req.params.id;
    const company_id = Request.GetCompanyId(req);

    let params={
      id: id,
      company_id: company_id
    }
    let data = await AddressService.get(params, res);
    res.json(data);
} catch(err){
    console.log(err);
}
};

module.exports = get;