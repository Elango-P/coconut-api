/**
 * Module dependencies
 */
const async = require("async");

// Constants
const { BAD_REQUEST, OK } = require("../../helpers/Response");

// Models
const { product } = require("../../db").models;

const Request = require("../../lib/request");

//systemLog
const History = require("../../services/HistoryService");
const { reindex } = require("../../services/ProductService");
const ObjectName = require("../../helpers/ObjectName");
/**
 * Product bulk update route
 */
async function bulkUpdate(req, res, next) {

    const companyId = Request.GetCompanyId(req);

    try {
        const data = req.body;
        const productIds = data.selectedIds;

        // Validate product id
        if (productIds.length == 0) {
            return res.json(BAD_REQUEST, { message: "Product id is required", });
        }

        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const updateData = {};

            if (data.categoryId) {
                updateData.category_id = data.categoryId;
            }

            // Update product
            await product.update(updateData, { where: { id: productId, company_id: companyId } });
            await reindex(productId, companyId);

        }

        //create system log for bulk updation
        res.on("finish", async () => {
            History.create("Products bulk updated", req, ObjectName.PRODUCT);
        });

        // API response
        return res.json(OK, { message: "Products updated", });

    } catch (err) {
        console.log(err);
    }
};

module.exports = bulkUpdate;
