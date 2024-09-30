const ObjectName = require('../helpers/ObjectName');
const DateTime = require('../lib/dateTime');
const Request = require('../lib/request');
const History = require('./HistoryService');
const String = require('../lib/string');
const validator = require('../lib/validator');
const Boolean = require('../lib/Boolean');
const { Op, literal } = require('sequelize');
const { monthOption, DayOptions, WeekOptions, TaskType } = require('../helpers/RecurringTask');
const Status = require('../helpers/Status');
const Response = require('../helpers/Response');
const Permission = require('../helpers/Permission');
const DataBaseService = require("../lib/dataBaseService");
const TicketService = require("./TicketService")
const NotificationService = require("../services/notifications/ticket");
const Number = require("../lib/Number");
const { getValueByObject, getSettingValue } = require("./SettingService");
const Setting = require("../helpers/Setting");

// Model
const {
  RecurringTaskModel,
  User,
  Project,
  ProjectTicketType,
  TicketIndex,
  account: AccountModel,
} = require('../db').models;

const RecurringTaskModelService = new DataBaseService(RecurringTaskModel);
const TicketIndexModel = new DataBaseService(TicketIndex);
const create = async (req, res) => {
  try {
    let body = req.body;
    const company_id = Request.GetCompanyId(req);
    let assigneeId = body.assignee;

    if (!assigneeId) {
      return res.json(Response.BAD_REQUEST, { message: 'Assignee is required' });
    }

    let query = {
      order: [['createdAt', 'DESC']],
      where: { company_id },
      attributes: ['item'],
    };
    
    let lastItemData = await RecurringTaskModel.findOne(query);
    let item;
    let itemNumberData = lastItemData && lastItemData.get('item');
    if (!itemNumberData) {
      item = 1;
    } else {
      item = itemNumberData + 1;
    }
    
    let dayValue;
    try {
      dayValue = body?.day && JSON.parse(body?.day);
    } catch (error) {
      dayValue = body?.day;
    }
    
    let createData = {
      summary: body.summary || '',
      day: dayValue ? dayValue.join(',') : '',
      date: body?.date || null,
      month: body.month || null,
      item: item,
      status: Status.ACTIVE,
      company_id: company_id,
      type: body.taskType || '',
      assignee_id: assigneeId,
      project_id: body?.project_id || null,
      ticket_type_id: body?.ticketType || null,
      object_name: body?.objectName || '',
      account_id: body?.account_id || null,
      amount: body?.amount || null,
    };

    if (body?.start_date) {
      createData.start_date = body.start_date;
    }

    if (body?.end_date) {
      createData.end_date = body.end_date;
    }

    let taskDetails = await RecurringTaskModel.create(createData);
    res.json(Response.OK, {
      message: 'Task Added',
      taskDetails: taskDetails,
    });
    
    res.on('finish', () => {
      // Create system log for task creation
      History.create("Task Added", req, ObjectName.RECURRING_TASK, taskDetails.id);
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};


async function getdetail(req, res, next) {
  const { id } = req.params;
  try {
    const company_id = Request.GetCompanyId(req);
    if (!id) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid Id' });
    }
    const TasktData = await RecurringTaskModel.findOne({
      where: {
        id: id,
        company_id: company_id,
      },
      include: [
        { model: User, as: 'assignee' },
        {
          required: false,
          model: AccountModel,
          as: 'accountDetail',
        },
      ],
    });

    if (!TasktData) return res.json(Response.OK, { message: 'No Records Found' });
    let {
      summary,
      item,
      day,
      date,
      month,
      type,
      createdAt,
      assignee_id,
      updatedAt,
      description,
      assignee,
      status,
      project_id,
      ticket_type_id,
      start_date,
      end_date,
      account_id,
      accountDetail,
      amount,
      object_name,
    } = TasktData.get();

    const dayValue = day && day?.split(',');

    let data = {
      id,
      summary,
      item,
      createdAt,
      assignee_id,
      day: dayValue,
      date,
      month,
      type,
      updatedAt,
      assignee: String.concatName(assignee?.name, assignee?.last_name),
      description,
      status: status == Status.ACTIVE ? Status.ACTIVE_TEXT : Status.INACTIVE_TEXT,
      project_id: project_id,
      ticket_type_id: ticket_type_id,
      start_date,
      account_id,
      accountName: accountDetail && accountDetail?.name,
      amount,
      object_name,
      end_date,
    };
    res.json(Response.OK, data);
  } catch (err) {
    next(err);
    console.log(err);
  }
}

async function search(req, res, next) {
  let { page, pageSize, search, sort, sortDir, pagination, user } = req.query;
  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    return res.json(Response.BAD_REQUEST, { message: 'Invalid page' });
  }
  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    return res.json(Response.BAD_REQUEST, { message: 'Invalid page size' });
  }
  const companyId = req.user && req.user.company_id;
  if (!companyId) {
    return res.json(Response.BAD_REQUEST, { message: 'Company Not Found' });
  }
  // Sortable Fields
  const validOrder = ['ASC', 'DESC'];
  const sortableFields = {
    id: 'id',
    summary: 'summary',
    assignee_id: 'assignee_id',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };
  const sortParam = sort || 'createdAt';
  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    return res.json(Response.BAD_REQUEST, {
      message: `Unable to sort task by ${sortParam}`,
    });
  }
  const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
  }

  const where = {};
  const data = req.query;
  const startDate = data.startDate;
  // startDate filter
  const endDate = data.endDate;
  let timeZone = Request.getTimeZone(req);
  let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
  let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)

  if (startDate && !endDate) {
    where.createdAt = {
      [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,timeZone),
      },
    };
  }
  // endDate filter
  if (endDate && !startDate) {
    where.createdAt = {
      [Op.and]: {
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },
    };
  }
  // startDate and endDate filter
  if (startDate && endDate) {
    where.createdAt = {
      [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,timeZone),
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },
    };
  }

  const manageOtherPermission = await Permission.Has(Permission.RECURRING_TASK_MANAGE_OTHERS, req);

  if (!manageOtherPermission) {
    let userId = Request.getUserId(req);
    if (userId) {
      where.assignee_id = userId;
    }
  }
  // user filter
  if (user) {
    where.assignee_id = data.user;
  }

  if (Number.isNotNull(data.objectName)) {
    where.object_name = data.objectName;
  }

  where.company_id = companyId;
  // Search by name
  const summary = data.summary;
  if (summary) {
    where.summary = {
      $like: `%${summary}%`,
    };
  }
  // Search term
  const searchTerm = search ? search.trim() : null;
  if (searchTerm) {
    where[Op.or] = [
      {
        summary: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
      literal(`"assignee"."name" || ' ' || "assignee"."last_name" ILIKE '%${searchTerm}%'`)
    ];
  }
  const query = {
    order:
      sort !== 'name'
        ? [[sortableFields[sortParam], sortDirParam]]
        : [[{ model: User, as: 'assignee' }, 'name', sortDir]],
    where,
    include: [
      {
        required: false,
        model: User,
        as: 'assignee',
        attributes: ['name','last_name','media_url'],
      },
      {
        required: false,
        model: Project,
        as: 'projectDetail',
      },
      {
        required: false,
        model: ProjectTicketType,
        as: 'ticketTypeDetail',
      },
      {
        required: false,
        model: AccountModel,
        as: 'accountDetail',
      },
    ],
  };

  if (validator.isEmpty(pagination)) {
    pagination = true;
  }
  if (Boolean.isTrue(pagination)) {
    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }
  const company_id = Request.GetCompanyId(req);
  try {
    // Get task list and count
    const taskDetails = await RecurringTaskModel.findAndCountAll(query);
    // Return task is null
    if (taskDetails.count === 0) {
      return res.json({});
    }
    const data = [];

    for (let index = 0; index < taskDetails.rows.length; index++) {
      const task = taskDetails.rows[index];
      const {
        id,
        summary,
        assignee_id,
        date,
        type,
        item,
        status,
        createdAt,
        day,
        month,
        projectDetail,
        ticketTypeDetail,
        start_date,
        account_id,
        accountDetail,
        amount,
        end_date,
        assignee
      } = task.get();

      const dayValue = day && day.split(',');

      let monthValue = monthOption.find((data) => data?.value == month);
      data.push({
        id: id,
        summary: summary,
        month: monthValue,
        date: date,
        day: dayValue,
        status: status == Status.ACTIVE ? Status.ACTIVE_TEXT : Status.INACTIVE_TEXT,
        createdAt: createdAt,
        assignee_id: assignee_id,
        firstName: assignee?.name,
        lastName: assignee?.last_name,
        media_url: assignee && assignee?.media_url,
        item: item,
        type: type,
        project_name: projectDetail && projectDetail?.name,
        project_id: projectDetail && projectDetail?.id,
        type_name: ticketTypeDetail && ticketTypeDetail?.name,
        type_id: ticketTypeDetail && ticketTypeDetail?.id,
        start_date,
        end_date,
        account_id,
        accountName: accountDetail && accountDetail?.name,
        amount: amount,
      });
    }
    res.json(Response.OK, {
      totalCount: taskDetails.count,
      currentPage: page,
      pageSize,
      data,
      search,
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

const update = async (req, res) => {
  try {
    let body = req.body;

    let taskId = req.params.id;
    const company_id = Request.GetCompanyId(req);
    let assigneeId = body.assignee;
    if (!assigneeId) {
      return res.json(Response.BAD_REQUEST, { message: 'Assignee is required' });
    }

    let dayValue;

    try {
      dayValue = body?.day && JSON.parse(body?.day);
    } catch (error) {
      dayValue = body?.day;
    }

    let updateData = {};

    if (body.summary) {
      updateData.summary = body.summary;
    }
    updateData.day =
      body.taskType == TaskType.MONTHLY
        ? null
        : body.taskType == TaskType.ANNUALLY
        ? null
        : body.taskType == TaskType.DAILY
        ? null
        : dayValue.join(',');
    if (body.date) {
      updateData.date = body.taskType == TaskType.DAILY ? null : body.date;
    }

    if (body.month) {
      updateData.month = body.taskType == TaskType.ANNUALLY ? body.month : null;
    }

    if (body.summary) {
      updateData.summary = body.summary;
    }

    if (body.taskType) {
      updateData.type = body.taskType;
    }

    if (body.assignee) {
      updateData.assignee_id = assigneeId;
    }

    if (body?.start_date) {
      updateData.start_date = body.start_date;
    }

    updateData.end_date = body.end_date ? body.end_date : null;

    updateData.project_id = body?.project_id ? body?.project_id : null;
    updateData.ticket_type_id = body?.ticketType ? body?.ticketType : null;

    if (body?.account_id) {
      updateData.account_id = body.account_id;
    }

    if (body?.amount) {
      updateData.amount = body.amount;
    }

    let taskDetails = await RecurringTaskModel.update(updateData, {
      where: { id: taskId, company_id: company_id },
    });

    res.json(Response.OK, {
      message: 'Task Updated',
      taskDetails: taskDetails,
    });
    res.on('finish', () => {
      // Create system log for task creation
      History.create("Task Updated", req, ObjectName.RECURRING_TASK, taskId);
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const del = async (req, res) => {
  try {
    //get company Id from request
    let taskId = req.params.id;

    //get company Id from request
    const companyId = Request.GetCompanyId(req);

    //validate Recurring Task Id exist or not
    if (!taskId) {
      return res.json(Response.BAD_REQUEST, { message: 'Recurring Task Not Found' });
    }

    //delete Recurring Task
    await RecurringTaskModel.destroy({ where: { id: taskId, company_id: companyId } });

    res.on('finish', async () => {
      History.create("Recurring Task Deleted", req, ObjectName.RECURRING_TASK, taskId);
    });

    res.json(Response.OK, { message: 'Recurring Task Deleted' });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};
const updateStatus = async (req, res, next) => {
  const data = req.body;

  const { id } = req.params;
  let company_id = Request.GetCompanyId(req);
  // Validate task id
  if (!id) {
    return res.json(Response.BAD_REQUEST, { message: 'Task id is required' });
  }

  // Update task status
  const updateTask = {
    status: data.status,
  };
  try {
    const save = await RecurringTaskModel.update(updateTask, { where: { id: id, company_id } });

    res.json(Response.UPDATE_SUCCESS, {
      message: 'Task Status updated',
    });

    res.on('finish', async () => {
      History.create("Task Status updated", req, ObjectName.RECURRING_TASK, save.id);
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
};

const CreateRecurringTask = async (req, details, companyId, date) => {
  try {
    let systemUser = await getSettingValue(Setting.SYSTEM_USER, companyId);
    let isTicketExist = await TicketIndexModel.findOne({
      where: {
        recurring_task_id: details?.id,
        type_id: details?.ticket_type_id,
        project_id: details?.project_id,
        ticket_date: date,
        company_id: companyId,
      },
    });
    req.body = {
      projectId: details?.project_id,
      summary: details?.summary,
      assignee_id: details?.assignee_id,
      type_id: details?.ticket_type_id,
      recurring_task_id: details?.id,
      eta: date,
      systemUser:systemUser,
      ticket_date: date
    };
    req.body.summary = `${details?.summary} - ${
      details?.type == TaskType.DAILY
        ? DateTime.shortMonthDate(date)
        : details?.type == TaskType.WEEKLY
        ? DateTime.shortMonthDate(date)
        : details?.type == TaskType.MONTHLY
        ? `${DateTime.getMonth(date, "long")} ${DateTime.getYear(date)}`
        : DateTime.getYear(date)
    }`;

    if (!isTicketExist) {
      // Check Daily
      if (details?.type == TaskType.DAILY) {
        let data = await TicketService.create(req);
        if(data){
          await createAuditLog(data,systemUser,details,req,companyId)
        }
      }

      // Check Weekly
      if (details?.type == TaskType.WEEKLY) {
        let days = details && details?.day && details?.day.split(",");
        let day = DateTime.getDayByDate(date)
        // Check all days inculdes today Date  
        if (days.includes(day)) {
          let data = await TicketService.create(req);
          if(data){
            await createAuditLog(data,systemUser,details,req,companyId)
          }
        }
      }

      // Check Monthly
      if (details?.type == TaskType.MONTHLY) {
        let currentDate = DateTime.getCurrentDay(date);
        let ticketDate = details?.date;

        // Date Check
        if (parseInt(ticketDate) == parseInt(currentDate)) {
          let data = await TicketService.create(req);
          if(data){
            await createAuditLog(data,systemUser,details,req,companyId)
          }
        }
      }

      if (details?.type == TaskType.ANNUALLY) {
        let currentMonth = DateTime.getCurrentMonth();
        let ticketMonth = details?.month;

        let currentDate = DateTime.getCurrentDay(date);
        let ticketDate = details?.date;
        // Month check
        if (parseInt(ticketMonth) == parseInt(currentMonth)) {
          // Date Check
          if (parseInt(ticketDate) == parseInt(currentDate)) {
            let data = await TicketService.create(req);
            if(data){
              await createAuditLog(data,systemUser,details,req,companyId)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const createTask = async (req, params) => {
  try {
    let RecurringTasksList = await getActiveTasks(params);

    if (RecurringTasksList && RecurringTasksList.length > 0) {
      for (let i = 0; i < RecurringTasksList.length; i++) {
        await CreateRecurringTask(req, RecurringTasksList[i], params?.companyId, new Date());
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const createMissingTask = async (req, params) => {
  let RecurringTasksList = await RecurringTaskModelService.find({
    where: {
      object_name: ObjectName.RECURRING_TASK,
      company_id: params?.companyId,
    },
  });

  if (RecurringTasksList && RecurringTasksList.length > 0) {
    for (let i = 0; i < RecurringTasksList.length; i++) {
      const dates = DateTime.getDateOnlyRange(RecurringTasksList[i]?.start_date, new Date());
      if (dates && dates.length > 0) {
        for (let j = 0; j < dates.length; j++) {
          const date = dates[j];
          await CreateRecurringTask(req, RecurringTasksList[i], params?.companyId, date);
        }
      }
    }
  }
};

const getActiveTasks = async (params) => {
  try {
    let RecurringTasksList = await RecurringTaskModelService.find({
      where: {
        object_name: ObjectName.RECURRING_TASK,
        company_id: params?.companyId,
        [Op.and]: [
          {
            [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: DateTime.shortMonthDate(new Date()) } }],
          },
          {
            [Op.or]: [{ start_date: null }, { start_date: { [Op.lte]: DateTime.shortMonthDate(new Date()) } }],
          },
        ],
      },
    });
    return RecurringTasksList;
  } catch (err) {
    console.log(err);
    throw err; // Re-throwing the error to handle it outside
  }
};

const createAuditLog =async (data,systemUser,details,req,companyId)=>{
  if (data?.historyMessage && data?.historyMessage.length > 0) {
    let message = data?.historyMessage.join();
    History.create(`Created with the following: ${message}`, req, ObjectName.TICKET, data?.ticketDetails?.id,systemUser);
  } else {
    History.create("Ticket Added", req, ObjectName.TICKET, data?.ticketDetails?.id);
  }

  if (data && data?.ticketDetails) {
    if (details?.assignee_id) {
      NotificationService.sendTicketAssigneeNotification(data?.ticketDetails?.id, req?.user?.id);
    }
    await TicketService.reindex(data?.ticketDetails?.id, companyId);
  }
}

module.exports = {
  create,
  getdetail,
  search,
  update,
  del,
  updateStatus,
  createTask,
  createMissingTask,
  getActiveTasks,
  createAuditLog
};
