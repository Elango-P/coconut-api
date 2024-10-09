// import service
const ShiftService = require("../../services/ShiftService");

const { Shift } = require("../../db").models;

const DataBaseService = require("../../lib/dataBaseService");

const shiftService = new DataBaseService(Shift);

const Date = require("../../lib/dateTime");

const Request = require("../../lib/request");
const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");

async function create(req, res, next) {
  try {
    const data = req.body;

    let companyId = Request.GetCompanyId(req);

    //Validation
    const isNameExists = await ShiftService.isNameExist(data.name, companyId);
    if (isNameExists) {
      return res.send(400, { message: "shift already exist" });
    }

    // Create shift Data
    const createData = {
      name: data && data?.name,
      status: data && data?.status,
      start_time: Date.GetGmtDate(data?.start_time),
      end_time: Date.GetGmtDate(data?.end_time),
      company_id: companyId,
      grace_period: data && data?.grace_period ? data?.grace_period : null
    };

    try {
      const shift = await shiftService.create(createData);

      res.send(201, {
        message: "shift Created",
      });

      // History On Finish Function
      res.on(("finish"), async () => {
        History.create("Shift Created", req, ObjectName.SHIFT, shift.id);
      })
    } catch (err) {
      console.log(err);
      res.send(400, err);
      next(err);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = create;