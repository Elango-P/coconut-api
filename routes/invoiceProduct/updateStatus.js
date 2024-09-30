const Response = require("../../helpers/Response");
const invoiceProductService = require("../../services/invoiceProductService");

const updateStatus = async (req, res, next) => {
  try {
    const data = req.body;
  const { id } = req.params;
  const companyId = req.user && req.user.company_id;
   let response= await invoiceProductService.updateStatus(id, data, companyId);
   if(response[0]==1){
  res.json(Response.UPDATE_SUCCESS, { message: "Product Invoice Status Updated"});

   }
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message })

  }
};

module.exports = updateStatus;