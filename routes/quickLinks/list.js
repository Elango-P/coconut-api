// Models
const { QuickLinks } = require("../../db").models;

const process = require("./process");

function list(req, res) {
  const userId = req.user.id;

  QuickLinks.findAll({
    attributes: [
      "name",
      "status_id",
      "group_id",
      "type",
      "show_current_user",
      "excluded_user",
      "ticket_type",
      "project_id",
      "release_id",
      "url",
    ],
    where: { role: req.user.role, status: 1 },
    order: [["sort"]],
  }).then((results) => {
    const quickLinks = [];
    results.forEach((quickLink) => {
      quickLinks.push(process(quickLink.get(), userId));
    });

    res.json(quickLinks);
  }).catch((err)=>{
    console.log(err);
  })
}

module.exports = list;
