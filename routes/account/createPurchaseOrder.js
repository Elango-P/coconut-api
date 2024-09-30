const Response = require("../../helpers/Response");
const Request = require("../../lib/request");

const purchaseOrderCreateService = require('../../services/purchaseOrderCreateService');

async function create(req, res, next) {

    try {
        let data = req.body

        const companyId = Request.GetCompanyId(req);

        let params = { companyId: companyId, purchaseOrderId:data.purchaseOrderId, accountId:data.account_id,loggedInUser : req.user.id };

        if (companyId) {
            await purchaseOrderCreateService.create(params);

            res.json(Response.OK, {
                message: 'Purchase Order Updated',
            });
        }

    } catch (err) {
        console.log(err);
    }
};

module.exports = create;