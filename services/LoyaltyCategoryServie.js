const ObjectName = require('../helpers/ObjectName');
const { OK, BAD_REQUEST } = require('../helpers/Response');
const Request = require('../lib/request');
const History = require('./HistoryService');
const { loyaltyCategory} = require('../db').models;
const validator = require('../lib/validator');
const Boolean = require('../lib/Boolean');
const { Sequelize, Op } = require('sequelize');
const Response = require('../helpers/Response');
const MediaService = require('./MediaService');
const { getMediaUrl } = require("../lib/utils");
const MediaServices = require("./media");
const { Media } = require("../helpers/Media");


class LoyaltyCategoryService {
  static async create(req, res, next) {
    try {
      let data = req.body;
      const companyId = Request.GetCompanyId(req);

      const createData = {
        name: data.category_name,
        company_id: companyId,
      };

      let Detail = await loyaltyCategory.create(createData)


      let id = Detail && Detail?.id

      res.json(OK, { message: "Category added", id: id });

      res.on('finish', async () => {
        
        History.create("Category added", req, ObjectName.LOYALTY_CATEGORY, id);

        

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
        return res.json(BAD_REQUEST, { message: "Category id is required" });
      }

      const detail = await loyaltyCategory.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!detail) {
        return res.json(BAD_REQUEST, { message: "Invalid Category id" });
      }
      const updateData = {
        id: id,
        name: data?.name,
      };
     
      const datas = await loyaltyCategory.update(updateData, { where: { id } });

      res.on("finish", async () => {
        History.create('Category Updated', req, ObjectName.LOYALTY_CATEGORY, id);
      });

      return res.json(Response.UPDATE_SUCCESS, {
        message: "Category Updated",
        data: data
      });

    } catch (err) {
      console.log(err);
    }


  }
  //search
  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    // Validate if page size is not a number
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
      name : 'name',
    };
    const sortParam = sort || 'createdAt';
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(Response.BAD_REQUEST, { message: `Unable to sort category by ${sortParam}` });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
    }
    const where = {};

    where.company_id = companyId
    const searchTerm = search ? search.trim() : ""
    if (searchTerm) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },

        },
      ];

    }


    const query = {
      attributes: { exclude: ['deletedAt'] },

      
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
      const details = await loyaltyCategory.findAndCountAll(query);
      if (details.count === 0) {
        return res.json({ message: 'Category not found' });
      }

      details.rows.forEach(async (loyaltyCategory) => {

        const { id,name,createdAt } = loyaltyCategory.get();
        data.push({
          id,
          name : name,
          createdAt:createdAt,
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

  //get

  static async get(req, res, next) {
    try {
      const { id } = req.params;
      const companyId = Request.GetCompanyId(req);
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'category Id is required' });
      }

      const detail = await loyaltyCategory.findOne({
        where: { id: id, company_id: companyId },
      });

     

      if (!detail) {
        return res.json(BAD_REQUEST, { message: 'category Not found' });
      }


      const data = {
        id: detail?.id,
        name: detail?.name,
      };
      res.json(OK, { data: data });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async del(req, res) {
    try {
      const id = req.params.id;
      const company_id = Request.GetCompanyId(req);
      await loyaltyCategory.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'Category Deleted' });

      res.on('finish', async () => {
        await History.create("Category Deleted", req, ObjectName.LOYALTY_CATEGORY, id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }
}

module.exports = LoyaltyCategoryService;
