const { Salary } = require("../../db").models;

const ObjectName = require("../../helpers/ObjectName");
const { UPDATE_SUCCESS, BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request");
const String = require("../../lib/string");
const history = require("../../services/HistoryService");
const StatusService = require("../../services/StatusService");

async function updateStatus(req, res, next) {
  const data = req.body;
  const ids = String.ParseString(data?.selectedIds);

  try {
    const company_id = Request.GetCompanyId(req);
    let selectedIds = ids ? ids.split(",") : [];

    if (!selectedIds || !Array.isArray(selectedIds)) {
      return res.json(400, { message: "Invalid IDs provided" });
    }

    if (selectedIds && selectedIds.length > 0) {
      for (let i = 0; i < selectedIds.length; i++) {
        await Salary.update(
          { status: data?.status },
          {
            where: { id: selectedIds[i], company_id: company_id },
          }
        );
      }
    }

    // API response
    res.json(UPDATE_SUCCESS, { message: "Salary Updated" });

      let statusData = await StatusService.getData(data?.status, company_id);

      let message = statusData?.name;

    // create a log
    res.on("finish", async () => {
      history.create(`Salary Status Updated To ${message}`, req, ObjectName.SALARY, ids);
    });
  } catch (err) {
    res.json(BAD_REQUEST, { message: err.message });
    console.log(err);
  }
}
module.exports = updateStatus;
