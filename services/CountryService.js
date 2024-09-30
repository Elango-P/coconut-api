const { BAD_REQUEST, OK, UPDATE_SUCCESS, DELETE_SUCCESS } = require('../helpers/Response');

// Services
const { Country, State } = require('../db').models;
const Request = require('../lib/request');
const { GetCompanyId } = require('../lib/request');
const { Op } = require('sequelize');
const { getPageDetails } = require('../lib/utils');
const History = require("./HistoryService");
const ObjectName = require("../helpers/ObjectName");
const Boolean = require('../lib/Boolean');
const validator = require("../lib/validator");
const Response = require('../helpers/Response');
const Number = require("../lib/Number")

class CountryService {
  static async create(req, res) {
    try {
      const data = req.body;

      if (!data) {
        throw { message: 'Country Details Required' };
      }

      const companyId = Request.GetCompanyId(req);

      // Validate customer if already exist
      const countryExist = await Country.findOne({
        where: {
          country_name: data.country_name,
          company_id: companyId,
        },
      });

      if (countryExist) {
        throw { message: 'Country Already Exist' };
      }
      const createData = {
        country_name: data.country_name,
        company_id: companyId,
      };
     const details = await Country.create(createData);

     res.on("finish", async () => {
      //create system log for TagType updation
      History.create("Country Created", req,ObjectName.COUNTRY,details?.id);
    });

      res.json(OK, {
        message: "Country Created",
      });
    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, {
        message: err.message,
      });
    }
  }

  static async stateCreate(req, res) {
    try {
      const data = req.body;

      if (!data) {
        throw { message: 'Country Details Required' };
      }

      const companyId = Request.GetCompanyId(req);

      // Validate customer if already exist
      const stateExist = await State.findOne({
        where: {
          name: data.state,
          country_id:data.countryId,
          company_id: companyId,
        },
      });

      if (stateExist) {
        throw { message: 'state Already Exist' };
      }
      const createData = {
        name: data.state,
        country_id:data.countryId,
        company_id: companyId,
      };
     const details = await State.create(createData);

     res.on("finish", async () => {
      //create system log for TagType updation
      History.create("State Created", req,ObjectName.COUNTRY,details?.id);
    });

      res.json(OK, {
        message: 'State Created',
      });
    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, {
        message: err.message,
      });
    }
  }
  static async update(req, res) {
    try {
      // Getting id from params
      const { id } = req.params;
      let companyId = Request.GetCompanyId(req)
      // Getting data
      const data = req.body;

      // Validate country id
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'Country id is required' });
      }

      // Validate country is exist or not
      const countryDetails = await Country.findOne({
        where: { id, company_id: companyId },
      });

      if (!countryDetails) {
        return res.json(BAD_REQUEST, { message: 'Invalid country id' });
      }

      // Updating country details
      const updateCountry = { country_name: data.country_name };

      await countryDetails.update(updateCountry);
      res.on("finish", async () => {
        //create system log for TagType updation
        History.create("Country updated", req,ObjectName.COUNTRY,id);
      });
      return res.json(UPDATE_SUCCESS, { message: 'Country updated' });
    } catch (err) {
      console.log(err);
      return res.json(BAD_REQUEST, { message: err.message });
    }
  }
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const company_id = GetCompanyId(req);

      // Validate country id
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'Country id is required' });
      }

      // Validate country is exist or not
      const countryDetails = await Country.findOne({
        where: { id, company_id },
      });

      if (!countryDetails) {
        return res.json(BAD_REQUEST, { message: 'Country not found' });
      }

      // Deleting country
      await countryDetails.destroy();
      res.on("finish", async () => {
        //create system log for TagType updation
        History.create("Country updated", req,ObjectName.COUNTRY,id);
      });
      return res.json(DELETE_SUCCESS, { message: 'Country deleted' });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async stateDelete(req, res) {
    try {
      const { id ,country_id } = req.params;

      const company_id = GetCompanyId(req);

      // Validate country id
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'state id is required' });
      }

      // Validate country is exist or not
      const stateDetails = await State.findOne({
        where: { id, country_id: country_id, company_id:company_id },
      });

      if (!stateDetails) {
        return res.json(BAD_REQUEST, { message: ' state not found' });
      }

      // Deleting country
      await stateDetails.destroy();
      res.on("finish", async () => {
        //create system log for TagType updation
        History.create("State Deleted", req,ObjectName.COUNTRY,country_id);
      });
      return res.json(DELETE_SUCCESS, { message: 'state Deleted' });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }


  static async get(req, res) {
    try {
      // Getting id from params
      const { id } = req.params;

      let { stateList, page, pageSize, search, sort, sortDir } = req.query;

      let where = {};
    
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
      
      // Sortable Fields
      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        id: 'id',
        name: 'name',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };

      const sortParam = sort || 'createdAt';

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message: `Unable to sort product by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
      }

      if (search) {
        // Search term
        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
          where[Op.or] = [
            {
              name: { [Op.iLike]: `%${searchTerm}%` },
            },
          ];
        }
      }

      where.country_id = id;

      let query = {
        order: [[sortParam, sortDirParam]],
        where,
      };

      if (req.query.pagination) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      // Validate id
      if (!Number.isNotNull(id)) {
        return res.json(BAD_REQUEST, { message: 'Country id is required' });
      }
      let countryWhere={}
      if(Number.isNotNull(id)){
        countryWhere.id = id
      }
      // Validate country is exist or not
      const countryDetails = await Country.findOne({
        where: countryWhere,
      });

      if (!countryDetails) {
        return res.json(BAD_REQUEST, { message: 'Country not found' });
      }

      // Getting the country name based on its id
      const { country_name } = countryDetails.dataValues;

      // API response
      if (!stateList) return res.json(OK, { data: { id, country_name } });

      // If state list required
      if (stateList) {
        let stateDetails = await State.findAndCountAll(query);

        let stateData = [];

        stateDetails.rows.forEach((detail) => {
          let values = { ...detail.get() };
          stateData.push(values);
        });

        // Page details
        const { count, currentPage, lastPage, pageStart, pageEnd } = getPageDetails(
          stateDetails.count,
          page,
          pageSize,
          stateData.length
        );

        if (stateList)
          return res.json(OK, {
            data: stateData,
            totalCount: count,
            currentPage,
            lastPage,
            pageStart,
            pageEnd,
            pageSize,
          });
      }
    } catch (err) {
      // next(err);
      console.log(err);
      return res.json(BAD_REQUEST, { message: err.message });
    }
  }


  static async list(req, res,next)  {
    try {
        const companyId = Request.GetCompanyId(req);

        const where = new Object();

        where.company_id = companyId;

        const query = {
            where,
            order: [["country_name", "ASC"]],
        }

        // Get Status list and count
        const countryList = await Country.findAndCountAll(query);

        // Return Status is null
        if (countryList.count === 0) {
            return res.json({});
        }

        const data = [];

            for (let i = 0; i < countryList.rows.length; i++) {
                const value = countryList.rows[i];
                data.push({
                    name: value.country_name,
                    id:value.id
                });
            }

        res.json(Response.OK, { data });
    } catch (err) {
      console.log(err);
        res.json(Response.BAD_REQUEST, { message: err.message });
    }
}

  static async search(req, res,next) {
    try {
      let { page, pageSize, search, pagination, sort, sortDir } = req.query;

      let companyId = Request.GetCompanyId(req);
      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.send(400, { message: 'Invalid page' });
      }

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.send(400, { message: 'Invalid page size' });
      }
      let where = {};

      // Sortable Fields
      const validCountry = ['ASC', 'DESC'];
      const sortableFields = {
        id: 'id',
        country_name: 'country_name',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };

      const sortParam = sort || 'country_name';

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message: `Unable to sort Country by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
      // Validate Country is present in sortDir param
      if (!validCountry.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
      }

      where.company_id = companyId
      // Search term
      const searchTerm = search ? search.trim() : '';
      if (searchTerm) {
        where[Op.or] = [
          {
            country_name: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ];
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

      const country = await Country.findAndCountAll(query);
      const data = [];
      country.rows.forEach((result) => {
        data.push({
          id: result.id,
          name: result.country_name,
        });
      });

      res.send(200, {
        totalCount: country.count,
        currentPage: page,
        pageSize,
        data,
        sort,
        sortDir,
      });
    } catch (err) {
      next(err);
      console.log(err);
    }
  }
}
module.exports = CountryService;
