
const { Op } = require('sequelize');

// Helpers
const { BAD_REQUEST } = require('../../helpers/Response');
const Status = require('../../helpers/Status');
const { STATUS_ACTIVE } = require('../../helpers/User');
const Permission = require("../../helpers/Permission");

// Lib
const Request = require('../../lib/request');
const Boolean = require('../../lib/Boolean');
const validator = require('../../lib/validator');
const DateTime = require('../../lib/dateTime');

// DB
const { User, status: StatusModal,TicketIndex } = require('../../db').models;

const search = async (req, res, next) => {

  try {

  let { page, pageSize, search, sort, sortDir, pagination ,status} = req.query;
  const ticket_manage_others = await Permission.Has(Permission.TICKET_MANAGE_OTHERS, req);
  const defaultTimeZone = Request.getTimeZone(req);

  let currentDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(defaultTimeZone));

  page = page ? parseInt(page, 10) : 1;

  if (isNaN(page)) {
    return res.json(BAD_REQUEST, { message: 'Invalid page' });
  }

  pageSize = pageSize ? parseInt(pageSize, 10) : 25;

  if (isNaN(pageSize)) {
    return res.json(BAD_REQUEST, { message: 'Invalid page size' });
  }

  const companyId = Request.GetCompanyId(req);
  const userId = Request.getUserId(req)

  const validOrder = ['ASC', 'DESC'];
  const sortableFields = {
    id: 'id',
    created_at: 'created_at',
    updatedAt: 'updatedAt',
    name: 'name',
  };

  const sortParam = sort || 'name';

  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    return res.json(BAD_REQUEST, { message: `Unable to sort salary by ${sortParam}` });
  }

  const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
  }

  let where = {};
  where.company_id = companyId;
  
    where.status=STATUS_ACTIVE

    if(!ticket_manage_others){
      where.id = userId
    }
  
  const query = {
    order: [[sortParam, sortDirParam]],
    where,
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

  const getTicketCount = async (id, group, date,excludeGroup,isPendingCount) => {
    let ticketWhere = {};
    ticketWhere.company_id = companyId;
    if (id) {
      ticketWhere.assignee_id = id;
    }
    if (group && !date) {
      ticketWhere.status_group_id = group;
    }
    if (date) {
      ticketWhere.eta = {
        [Op.and]: {
          ...(isPendingCount ? {} : { [Op.gte]: DateTime.getSQlFormattedDate(date) }),
          ...(isPendingCount ? { [Op.lte]: DateTime.subtract(1) } : { [Op.lte]: DateTime.getSQlFormattedDate(date) }),
        },
      };
      if(excludeGroup){
        ticketWhere.status_group_id = { [Op.ne]: excludeGroup };
      }
    }

    const getTicketList = await TicketIndex.count({
      where: ticketWhere,
    });
    return getTicketList && getTicketList;
  };

  const getTicketStorysCount = async (id, group, date,excludeGroup,isPendingCount) => {
    let ticketWhere = {};
    ticketWhere.company_id = companyId;
    if (id) {
      ticketWhere.assignee_id = id;
    }
    if (group) {
      ticketWhere.status_group_id = group;
    }
    if (date ) {
      ticketWhere.eta = {
        [Op.and]: {
          ...(isPendingCount ? {} : { [Op.gte]: DateTime.getSQlFormattedDate(date) }),
          ...(isPendingCount ? { [Op.lte]: DateTime.subtract(1) } : { [Op.lte]: DateTime.getSQlFormattedDate(date) }),
        },
      };
      if(excludeGroup){
        ticketWhere.status_group_id = { [Op.ne]: excludeGroup };
      }
    }

    const getTicketStoryPoints = await TicketIndex.sum("story_points",{
      where: ticketWhere,
    });
    return getTicketStoryPoints && getTicketStoryPoints;
  };

  const getDashboardCount = async (id,currentDate) => {
    let inprogressCount = await getTicketCount(id, Status.GROUP_INPROGRESS,null,null,false);
    let newCount = await getTicketCount(id, Status.GROUP_NEW,null,null,false);
    let reviewCount = await getTicketCount(id, Status.GROUP_REVIEW,null,null,false);
    let holdticketCount=await getTicketCount(id, Status.GROUP_HOLD,null,null,false)
    let reopenTicketCount=await getTicketCount(id, Status.GROUP_REOPEN,null,null,false)
    let todayCount = await getTicketCount(id, null, currentDate,null,false);
    let pendingCount = await getTicketCount(id, null, currentDate,Status.GROUP_COMPLETED,true);

    let inprogressStoryPoint = await getTicketStorysCount(id, Status.GROUP_INPROGRESS,null,null);
    let newStoryPoint = await getTicketStorysCount(id, Status.GROUP_NEW,null,null);
    let reviewStoryPoint = await getTicketStorysCount(id, Status.GROUP_REVIEW,null,null);
    let holdStoryPoint=await getTicketStorysCount(id, Status.GROUP_HOLD,null,null)
    let reopenStoryPoint=await getTicketStorysCount(id, Status.GROUP_REOPEN,null,null)
    let todayStoryPoint = await getTicketStorysCount(id, null, currentDate,null);
    let pendingStoryPoint = await getTicketStorysCount(id, null, currentDate,Status.GROUP_COMPLETED,true);

    return {
      inprogress: inprogressCount == 0 ? '' : inprogressCount,
      new: newCount == 0 ? '' : newCount,
      review: reviewCount == 0 ? '' : reviewCount,
      todays: todayCount == 0 ? '' : todayCount,
      hold: holdticketCount == 0 ? '' : holdticketCount,
      reopen: reopenTicketCount == 0 ? '' : reopenTicketCount,
      pending: pendingCount == 0 ? '' : pendingCount,
      inprogressStoryPoint: inprogressStoryPoint ? inprogressStoryPoint : 0,
      newStoryPoint: newStoryPoint ? newStoryPoint : 0,
      reviewStoryPoint: reviewStoryPoint ? reviewStoryPoint : 0,
      holdStoryPoint: holdStoryPoint ? holdStoryPoint :0  ,
      reopenStoryPoint: reopenStoryPoint ? reopenStoryPoint:0,
      todayStoryPoint: todayStoryPoint ? todayStoryPoint :0,
      pendingStoryPoint: pendingStoryPoint ? pendingStoryPoint :0
    };
  };

  let data = [];

  const getUserList = await User.findAndCountAll(query);

  let userList = getUserList && getUserList.rows;
  
  for (let i = 0; i < userList.length; i++) {
    const { id, name, last_name,media_url } = userList[i];
    let getConut = await getDashboardCount(id,currentDate);
    let list = {
      firstName:name,
      lastName:last_name,
      user_id:id,
      media_url:media_url,
      ...getConut,
    };
    data.push(list);
  }

  return res.json(200, {
    totalCount: getUserList.count,
    currentPage: page,
    pageSize,
    data: data,
    sort,
    search,
    sortDir,
  });

} catch (error) {
    console.log(error);
}
};

module.exports = search;
