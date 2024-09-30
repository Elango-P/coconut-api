/**
 * Module dependencies
 */
const {
    BAD_REQUEST,
    UPDATE_SUCCESS,
    UNAUTHORIZED,
} = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");
const saleProductService = require("../../services/SaleProductService");


//systemLog
const History = require("../../services/HistoryService");

/**
 * Sale update route
 */
async function updateStatus(req, res, next) {
    saleProductService.updateStatus(req, res, next)
};
module.exports = updateStatus;
