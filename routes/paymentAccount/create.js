//Lib
const { BAD_REQUEST } = require("../../helpers/Response");
const paymentAccountService = require("../../services/PaymentAccountService");

// Model
const { Account } = require("../../db").models;

async function create(req, res, next) {
paymentAccountService.create(req, res, next);
}

module.exports = create;
