const { OK, CREATE_SUCCESS } = require("../../helpers/Response");
const HistoryService = require("../../services/HistoryService");

async function create(req, res, next) {
  try {

    let message = req.body.message;
    let object = req.body.OBJECT_NAME;
    let objectId = req.body.OBJECT_ID
    HistoryService.create(message, req, object, objectId)
    res.json(CREATE_SUCCESS)

  } catch (err) {
    console.log(err);
  }
};

module.exports = create;