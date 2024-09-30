const ObjectName = require('../helpers/ObjectName');
const { OK, BAD_REQUEST } = require('../helpers/Response');
const Request = require('../lib/request');
const History = require('./HistoryService');
const {locationSalesGoal,Shift,Location} = require('../db').models;
const validator = require('../lib/validator');
const Boolean = require('../lib/Boolean');
const {Op } = require('sequelize');
const Response = require('../helpers/Response');
const MediaService = require('./MediaService');


class locationSalesGoalService {
  static async create(req, res, next) {
    try {
      let data = req.body;
      const companyId = Request.GetCompanyId(req);
      const createData = {
        shift_id : data.shift_id,
        amount: data.amount,
        location_id : data.location_id,
        company_id: companyId,
      };

      let salesGoalDetail = await locationSalesGoal.create(createData)


      let id = salesGoalDetail && salesGoalDetail?.id

      res.json(OK, { message: 'Sales Goal added', id: id });

      res.on('finish', async () => {
        
        History.create("Sales Goal added", req, ObjectName.SALES_GOAL, id);


      });

    } catch (err) {
      next(err);
      console.log(err);
    }
  }


  // Update 
  static async update(req, res) {
    try {

      const companyId = Request.GetCompanyId(req);
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        return res.json(BAD_REQUEST, { message: "Sales Goal id is required" });
      }

      const details = await locationSalesGoal.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!details) {
        return res.json(BAD_REQUEST, { message: "Invalid Sales Goal id" });
      }
      const updateData = {
        id: id,
        shift_id: data?.shift_id,
        location_id : data?.location_id,
        amount : data?.amount
      };

      const datas = await locationSalesGoal.update(updateData, { where: { id } });

      res.on("finish", async () => {
        History.create("Sales Goal Updated", req, ObjectName.SALES_GOAL, id);
      });

      return res.json(Response.UPDATE_SUCCESS, {
        message: "Sales Goal Updated",
        data: data
      });

    } catch (err) {
      console.log(err);
    }


  }
  //search
  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination,location_id } = req.query;
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }

    const companyId = req.user && req.user.company_id;

    if (!companyId) {
      return res.json(400, 'Company Not Found');
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      createdAt: 'createdAt',
      location_id : 'location_id',
      shift_id : 'shift_id',
      amount : 'amount'
    };
    const sortParam = sort || 'createdAt';
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(Response.BAD_REQUEST, { message: `Unable to sort Sales Goal by ${sortParam}` });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
    }
    const where = {};
    where.company_id = companyId
    where.location_id = location_id


    const searchTerm = search ? search.trim() : ""
    if (searchTerm) {
      where[Op.or] = [
        {
          notes: {
            [Op.iLike]: `%${searchTerm}%`,
          },

        },
      ];

    }


    const query = {
      include: [
        {
          required: false,
          model: Shift,
          as: "shift",
          attributes: ["id", "name"]
        },
        {
          required: false,
          model: Location,
          as: "locationDetails",
          attributes: ["id", "name"]
      },
      ],
      order: [[sortableFields[sortParam], sortDirParam]],
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

    const data = [];
    try {
      // Get Vendor list and count
      const details = await locationSalesGoal.findAndCountAll(query);
      if (details.count === 0) {
        return res.json({ message: 'Sales Goal not found' });
      }

      details.rows.forEach(async (locationSalesGoal) => {

        const { id, shift_id,location_id,amount, locationDetails, shift ,createdAt } = locationSalesGoal.get();
        data.push({
          id,
          shift_id: shift_id,
          location_id: location_id,
          shiftName :shift && shift.name,
          locationName : locationDetails && locationDetails.name,
          createdAt:createdAt,
          amount : amount,
        });
      });
      res.send({
        totalCount: details.count,
        currentPage: page,
        pageSize,
        data,

      });
    } catch (err) {
      console.log(err);
      res.json(OK, { message: err.message });
    }
  }

  static async del(req, res) {
    try {
      const id = req.params.id;
      const company_id = Request.GetCompanyId(req);
      await locationSalesGoal.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'Sales Goal Deleted' });

      res.on('finish', async () => {
        await History.create("Sales Goal Deleted", req, ObjectName.SALES_GOAL, id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }
}

module.exports = locationSalesGoalService;
