const restify = require("restify");
const validator = require("../../lib/validator.js");
const { AccountEntry } = require("../../db").models;
const errors = require("restify-errors");
const Request = require("../../lib/request");
const AccountEntryService = require("../../services/AccountEntryService");

function get(req, res, next) {
  AccountEntryService.get(req, res, next)
}

module.exports = get;
