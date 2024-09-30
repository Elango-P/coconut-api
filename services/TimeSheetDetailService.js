const ObjectName = require("../helpers/ObjectName");
const { BAD_REQUEST } = require("../helpers/Response");
const Number = require("../lib/Number");
const Request = require("../lib/request");
const History = require("./HistoryService");
const Permission = require("../helpers/Permission");
const errors = require("restify-errors");
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");

const { TimeSheetDetail, status: statusModel, TimeSheet } = require("../db").models;

class TimeSheetDetailService {
  //create

  static async create(req, res, next) {
    try {
      let data = req.body;
      let companyId = Request.GetCompanyId(req);

      const timeSheet = await TimeSheet.findOne({
        where: {
          timesheet_number: data?.timesheet_number,
          company_id: companyId,
        },
      });
      if (!timeSheet) {
        return next(new errors.NotFoundError("Timesheet not found"));
      }

      let createData = {
        task: data?.task,
        duration: data?.duration,
        timesheet_id: timeSheet?.id,
        company_id: companyId,
        timesheet_number: data?.timesheet_number,
      };

      TimeSheetDetail.create(createData).then(async (response) => {
        let totalHours = await TimeSheetDetail.sum("duration", {
          where: { timesheet_id: timeSheet?.id, company_id: companyId },
        });

        timeSheet.update({ total_hours: totalHours });
        res.json(200, {
          message: "TimeSheetDetail Added",
        });
        res.on("finish", () => {
          History.create("TimeSheetDetail Added", req, ObjectName.TIMESHEET, response?.id);
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  //search
  static async search(req, res, next) {
    try {
      let { timeSheetNumber, timesheet_number, page, pageSize, sort, sortDir, pagination } = req.query;
      const companyId = Request.GetCompanyId(req);
      const hasPermission = await Permission.Has(Permission.TIMESHEET_MANAGE_OTHERS, req);

      let where = {};
      let timeSheetWhere = {};
      where.company_id = companyId;

      if (timesheet_number) {
        timeSheetWhere.timesheet_number = timesheet_number;
      }

      if (!hasPermission) {
        let userId = Request.getUserId(req);
        if (userId) {
          timeSheetWhere.user_id = userId;
        }
      }

      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        throw { message: "Invalid page" };
      }

      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        throw { message: "Invalid page size" };
      }

      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        status: "status",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        task: "task",
        duration: "duration",
      };
      const sortParam = sort || "createdAt";
      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort inventory by ${sortParam}` };
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
      }

      const query = {
        order: [["createdAt", "ASC"]],
        where: where,
      };
      query.include = [
        {
          required: true,
          model: TimeSheet,
          as: "timeSheet",
          where: timeSheetWhere,
        },
        {
          required: false,
          model: statusModel,
          as: "statusDetail",
        },
      ];

      if (validator.isEmpty(pagination)) {
        pagination = true;
      }
      if (Boolean.isTrue(pagination)) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      const TimeSheetDetailList = await TimeSheetDetail.findAndCountAll(query);
      let TimeSheetDetails = TimeSheetDetailList && TimeSheetDetailList.rows;
      let data = [];
      let totalHours = 0.0;
      for (let i in TimeSheetDetails) {
        let { id, timesheet_id, task, duration, statusDetail } = TimeSheetDetails[i];
       
        let list = {
          id: id,
          timesheet_id: timesheet_id,
          task: task,
          duration: duration,
        };
        data.push(list);
        totalHours += parseFloat(duration);
      }
      const totalDurations = Number.GetFloat(totalHours);
      return res.json(200, {
        totalCount: TimeSheetDetailList.count,
        data: data,
        totalHours: totalDurations,
        currentPage: page,
        pageSize,
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  //delete
  static async delete(req, res, next) {
    try {
      const data = req.params;
      const companyId = Request.GetCompanyId(req);

      const timeSheetDetails = await TimeSheetDetail.findOne({
        where: { id: data?.id, company_id: companyId },
      });

      if (!timeSheetDetails) {
        return next(new errors.NotFoundError("Timesheet not found"));
      }

      await timeSheetDetails.destroy();

      const totalHours = await TimeSheetDetail.sum("duration", {
        where: { timesheet_id: timeSheetDetails?.timesheet_id, company_id: companyId },
      });


      const updateData = {
        total_hours: totalHours,
      };

      await TimeSheet.update(updateData, {
        where: { id: timeSheetDetails?.timesheet_id, company_id: companyId },
      });

      res.json({ message: "TimesheetDetail Deleted" });

      res.on("finish", async () => {
        try {
          await History.create("TimesheetDetail Deleted", req, ObjectName.TIMESHEET, data?.id);
        } catch (err) {
          console.error("Error creating system log:", err);
        }
      });
    } catch (err) {
      console.error("Error in TimesheetDetail delete:", err);
      next(err);
    }
  }

  //update
  static update(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    let companyId = Request.GetCompanyId(req);

    if (!id) {
      return res.json(BAD_REQUEST, { message: "Timesheet id required" });
    }
    if (!companyId) {
      return res.json(BAD_REQUEST, { message: "CompanyId required" });
    }
    TimeSheetDetail.findOne({
      where: {
        id: id,
        company_id: companyId,
      },
    }).then((response) => {
      if (!response) {
        return next(new errors.NotFoundError("TimesheetDetail not found"));
      }
    });
    let updateData = {
      task: data?.task,
    };

    if (data?.task) {
      updateData.task = data?.task;
    }

    if (data?.duration) {
      updateData.duration = data?.duration;
    }
    TimeSheetDetail.update(updateData, {
      where: {
        id: id,
        company_id: companyId,
      },
    })
      .then((response) => {
        res.json({ message: " TimesheetDetail Updated" });
        res.on("finish", async () => {
          History.create("TimesheetDetail Updated", req, ObjectName.TIMESHEET, id);
        });
      })
      .catch((err) => {
        req.log.error(err);
        next(err);
      });
  }
}

module.exports = TimeSheetDetailService;
