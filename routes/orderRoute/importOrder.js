/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");

// Services
const orderService = require("../../services/OrderService");

//systemLog
const History = require("../../services/HistoryService");

/**
 * Import orders route
 */
async function importOrder(req, res, next) {
    const hasPermission = await Permission.Has(Permission.ORDER_IMPORT, req);
 
    if (!hasPermission) {
  
      return res.json(400, { message: "Permission Denied"});
    }
    const storeId = req.params.storeId;

    try {
        await orderService.importOrders(storeId);
        
        res.on("finish", async () => {
        //create a log for error
        History.create("Order imported", req);
        })
        // API response
        res.json(CREATE_SUCCESS, { message: "Order imported" });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
};

module.exports = importOrder;
