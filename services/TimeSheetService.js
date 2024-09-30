const ObjectName = require('../helpers/ObjectName');
const Request = require('../lib/request');
const History = require('./HistoryService');
const StatusService = require('../services/StatusService');
const { TimeSheet, User, status: statusModel } = require('../db').models;
const Permission = require("../helpers/Permission");
const Boolean = require('../lib/Boolean');
const validator = require('../lib/validator');
const { Op } = require('sequelize');
const DateTime = require("../lib/dateTime");

class TimeSheetService {
  static async create(req, res, next) {
    try {
      let data = req?.body;
      let companyId = Request.GetCompanyId(req);
      const status = await StatusService.getFirstStatus(ObjectName.TIMESHEET, companyId);
      let query = {
        order: [['createdAt', 'DESC']],
        where: { company_id: companyId },
        attributes: ['timesheet_number'],
      };

      let timeSheet = await TimeSheet.findOne(query)
      let timeSheetNumber;

      let timeSheetNumberData = timeSheet && timeSheet.get('timesheet_number')

      if (!timeSheetNumberData) {
        timeSheetNumber = 1;
      } else {
        timeSheetNumber = parseInt(timeSheetNumberData) + 1
      }

      let createData = {
        date: data?.date,
        user_id: data?.user_id,
        status: status,
        company_id: companyId,
        timesheet_number: timeSheetNumber
      };

      let detail = await TimeSheet.create(createData);
      res.json(200, {
        message: 'TimeSheet Added',
      });

      res.on('finish', () => {
        History.create("TimeSheet Added", req, ObjectName.TIMESHEET, detail?.id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async search(req, res, next) {
    try {
      let { page, pageSize, sort, sortDir, pagination, id, search, timesheet_number } = req.query;
      const companyId = Request.GetCompanyId(req);
      const hasPermission = await Permission.Has(Permission.TIMESHEET_MANAGE_OTHERS, req);

    let timeZone = Request.getTimeZone(req)


      let where = {};
      let userWhere = {};
      where.company_id = companyId;
      if (id) {
        where.id = id;
      }

      if (timesheet_number) {
        where.timesheet_number = timesheet_number
      }

      if (!hasPermission) {
        let userId = Request.getUserId(req)
        if (userId) {
          where.user_id = userId;
        }
      }
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        throw { message: 'Invalid page' };
      }

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        throw { message: 'Invalid page size' };
      }

      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        id:"id",
        user_name: 'user_name',
        date: 'date',
        status: 'status',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        timesheet_number: "timesheet_number"
      };
      const sortParam = sort || 'createdAt';
      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort inventory by ${sortParam}` };
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw { message: 'Invalid sort order' };
      }

      const searchTerm = search ? search.trim() : null;
      if (searchTerm) {
        userWhere[Op.or] = [
          {
            name: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            last_name: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ];
      }

      let order = [];
      if (sort === 'user_name') {
        order.push([{ model: User, as: 'user' }, 'name', sortDir]);
      }
      if (sort !== 'user_name' && sort) {
        order.push([sortParam, sortDirParam]);
      }

      const query = {
        order: order,
        where: where,
      };
      query.include = [
        {
          required: true,
          model: User,
          as: 'user',
          where: userWhere,
        },
        {
          required: false,
          model: statusModel,
          as: 'statusDetail',
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

      const TimeSheetList = await TimeSheet.findAndCountAll(query);
      let TimeSheetDetails = TimeSheetList && TimeSheetList.rows;
      let data = [];
      for (let i in TimeSheetDetails) {
        let { id, date, user, user_id, statusDetail, createdAt, timesheet_number, total_hours } = TimeSheetDetails[i];

        let list = {
          id: id,
          date: date,
          user_id: user_id,
          user_name: user?.name + ' ' + user?.last_name,
          status: statusDetail?.name,
          status_id: statusDetail?.id,
          color_code: statusDetail?.color_code,
          createdAt: DateTime.getDateTimeByUserProfileTimezone(createdAt,timeZone),
          timesheet_number: timesheet_number,
          media_url: user.media_url,
          total_hours: total_hours ? total_hours :""
        };
        data.push(list);
      }

      return res.json(200, {
        totalCount: TimeSheetList.count,
        currentPage: page,
        pageSize,
        data: data,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async delete(req, res, next) {
    let { timesheet_number } = req.params;
    const companyId = Request.GetCompanyId(req);

    let TimeSheetDetail = await TimeSheet.findOne({ where: { timesheet_number: timesheet_number, company_id: companyId } });
    if (!TimeSheetDetail) {
      return next(new errors.NotFoundError('Timesheet not found'));
    }
    TimeSheetDetail.destroy()
      .then(() => {
        res.json({ message: ' Timesheet Deleted' });
        res.on('finish', async () => {
          History.create("Timesheet Deleted", req, ObjectName.TIMESHEET, id);
        });
      })
      .catch((err) => {
        console.log(err);
        req.log.error(err);
        next(err);
      });
  }

  static statusUpdate(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    let companyId = Request.GetCompanyId(req);

    if (!id) {
      return res.json(BAD_REQUEST, { message: 'Timesheet id required' });
    }
    if (!companyId) {
      return res.json(BAD_REQUEST, { message: 'CompanyId required' });
    }
    TimeSheet.findOne({
      where: {
        id: id,
        company_id: companyId,
      },
    }).then((response) => {
      if (!response) {
        return next(new errors.NotFoundError('TimesheetDetail not found'));
      }
    });

    TimeSheet.update(
      { status: data?.status },
      {
        where: {
          id: id,
          company_id: companyId,
        },
      }
    )
      .then((response) => {
        res.json({ message: ' Status Updated' });
        res.on('finish', async () => {
          History.create("Status Updated", req, ObjectName.TIMESHEET, id);
        });
      })
      .catch((err) => {
        console.log(err);
        req.log.error(err);
        next(err);
      });
  }
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const companyId = Request.GetCompanyId(req);
  
      let query = {
        where: { company_id: companyId, timesheet_number: id },
        include: [
          {
            model: statusModel,
            as: 'statusDetail',
          },
        ],
      };
  
      // Find the TimeSheet by ID
      const timeSheet = await TimeSheet.findOne(query);
  
      if (!timeSheet) {
        return res.status(404).json({ message: 'TimeSheet not found' });
      }
  
      // Update the TimeSheet data
  
  if(data.date)    {
    timeSheet.date = data.date ;
  }
  if(data.user_id)
  {timeSheet.user_id = data.user_id;}
  if(data.total_hours){
    timeSheet.total_hours=data.total_hours;
  }
  
      // Save the updated TimeSheet
      await timeSheet.save();
  
      res.json(200, {
        message: 'TimeSheet Updated',
      },timeSheet.id);
  
      res.on('finish', () => {
        History.create("TimeSheet updated", req, ObjectName.TIMESHEET, timeSheet.id);
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = TimeSheetService;
