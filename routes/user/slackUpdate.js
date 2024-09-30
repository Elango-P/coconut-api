const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const { Slack } = require("../../db").models;
const validator = require("../../lib/validator");
async function slackUpdate(req, res, next) {

  const data = req.body;
  const { id } = req.params;

  if (!id) {
    return res.json(400, { message: "User id is required" });
  }
  let companyId = Request.GetCompanyId(req);
  let slackDetails;
  if (validator.isKeyAvailable(data, "slack_id")) {
    if (data && data?.slack_id) {
      let slackDetail = await Slack.findOne({
        where: {
          object_id: id,
          company_id: companyId,
        },
      });
      let createData = {
        object_id: id,
        object_name: ObjectName.USER,
        slack_id: data?.slack_id ? data?.slack_id : "",
        slack_name: data?.slack_name ? data?.slack_name : "",
        company_id: companyId,
      };
      if (slackDetail) {
        slackDetails = await Slack.update(createData, {
          where: {
            id: slackDetail && slackDetail?.id,
            object_id: id,
            company_id: companyId,
          },
        });
      } else {
        slackDetails = await Slack.create(createData);
      }
    }
  } else {
    let slackDetail = await Slack.findOne({
      where: {
        object_id: id,
        company_id: companyId,
        object_name: ObjectName.USER,
      },
    });
    slackDetail.destroy();
  }
  res.send(200, { message: "User Updated" });
  res.on('finish', () => {
    History.create(
      'User Updated',
      req,
      ObjectName.USER,
      slackDetails.id
    );
  });
}
module.exports = slackUpdate;
