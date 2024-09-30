
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");

// Services

const Request = require('../../lib/request');

const locationProductService = require("../../services/locationProductService")

async function reIndex(req, res) {
    try {
        let productId = req && req.params && req.params.product_id;


        const companyId = Request.GetCompanyId(req);

        if (!productId) {
            return res.json(BAD_REQUEST, { message: "Product Id is Required", })
        }


            await locationProductService.Reindex(companyId,productId);
            
        res.json(CREATE_SUCCESS, { message: "ReIndex Completed", })


    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = reIndex;
