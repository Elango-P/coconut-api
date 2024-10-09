const Request = require('../lib/request');
const History = require('./HistoryService');
const ObjectName = require('../helpers/ObjectName');
const DataBaseService = require('../lib/dataBaseService');
const { userRoleService } = require('./UserRoleService');
// const TransferTypeStatus = require('../helpers/AccountType');
/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require('../helpers/Response');

//Utils
const { defaultDateFormat } = require('../lib/utils');
const { Op } = require('sequelize');

// const TransferTypeHelper = require('../helpers/AccountType');
const Status = require('../helpers/Status');
const Number = require("../lib/Number");
const { isKeyAvailable } = require("../lib/validator");
const { AccountType, Location } = require('../db').models;
const AccountTypeModal = new DataBaseService(AccountType);

class AccountTypeService {
  static async create(req, res) {
    try {
      const data = req.body;
      let companyId = Request.GetCompanyId(req);

      //Validation
      const isNameExists = await AccountTypeModal.findOne({
        where: { name: data.name, company_id: companyId },
      });

      if (isNameExists) {
        return res.send(400, { message: 'Account type already exist' });
      }

      //update AccountType details
      const detail = {
        name: data.name,
        status: data && data?.status ? data?.status?.value : data,
        company_id: companyId,
        category: Number.Get(data.category),
        show_product: data?.show_product,
        show_purchase: data?.show_purchase,
        show_purchase_order: data?.show_purchase_order,
        show_bill: data?.show_bill,
        show_loyalty: data?.show_loyalty,
        show_rating: data?.show_rating,
        show_file: data?.show_file,
        show_payment: data?.show_payment,
        show_addresses: data?.show_addresses,
        show_agreement: data?.show_agreement,
        show_contact: data?.show_contact,
        show_custom_field: data?.show_custom_field,
        show_settings: data?.show_settings,
      };

      const accountType = await AccountTypeModal.create(detail);

      res.send(201, {
        message: 'Account Type Created',
      });
      res.on('finish', async () => {
        History.create('Account Type Created', req, ObjectName.ACCOUNT, accountType.id);
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async search(req, res) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination } = req.query;

      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.send(400, { message: 'Invalid page' });
      }
      const company_id = Request.GetCompanyId(req);

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;

      if (isNaN(pageSize)) {
        return res.send(400, { message: 'Invalid page size' });
      }

      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        name: 'name',
        status: 'status',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        id: 'id',
      };

      const sortParam = sort || 'name';

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.send(400, { message: `Unable to sort tag by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(400, { message: 'Invalid sort order' });
      }

      const where = {};

      where.company_id = company_id;

      const status = req.query.status;

      if (status) {
        where.status = status;
      }

      // Search by term
      const searchTerm = search ? search.trim() : null;
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
        order: [[sortParam, sortDirParam]],
        where,
      };

      if (pagination) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      // Get list and count
      const results = await AccountTypeModal.findAndCount(query);

      const data = [];

      if (results.count === 0) {
        return res.send(200, data);
      }

      for (const accountTypeData of results.rows) {
        data.push({
          id: accountTypeData.id,
          name: accountTypeData.name,
          status: accountTypeData.status,
          category: accountTypeData.category,
          createdAt: defaultDateFormat(accountTypeData.createdAt),
          updatedAt: defaultDateFormat(accountTypeData.updatedAt),
          show_product: accountTypeData?.show_product,
          show_purchase: accountTypeData?.show_purchase,
          show_purchase_order: accountTypeData?.show_purchase_order,
          show_bill: accountTypeData?.show_bill,
          show_loyalty: accountTypeData?.show_loyalty,
          show_rating: accountTypeData?.show_rating,
          show_file: accountTypeData?.show_file,
          show_payment: accountTypeData?.show_payment,
          show_addresses: accountTypeData?.show_addresses,
          show_agreement: accountTypeData?.show_agreement,
          show_contact: accountTypeData?.show_contact,
          show_custom_field: accountTypeData?.show_custom_field,
          show_settings: accountTypeData?.show_settings,
        });
      }

      res.send({
        totalCount: results.count,
        currentPage: page,
        pageSize,
        data: data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Internal server error' });
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;

    try {
      const data = req.body;
      const name = data.name;
      const accountTypeExist = await AccountType.findOne({
        where: { id },
      });

      //update AccountType details
      const detail = {
        name: name,
        status: data && data.status ? data.status.value : data,
        category: Number.Get(data.category),
        show_product: data?.show_product,
        show_purchase: data?.show_purchase,
        show_purchase_order: data?.show_purchase_order,
        show_bill: data?.show_bill,
        show_loyalty: data?.show_loyalty,
        show_rating: data?.show_rating,
        show_file: data?.show_file,
        show_payment: data?.show_payment,
        show_addresses: data?.show_addresses,
        show_agreement: data?.show_agreement,
        show_contact: data?.show_contact,
        show_custom_field: data?.show_custom_field,
        show_settings: data?.show_settings,
      };

      const save = await accountTypeExist.update(detail);

      // API response
      res.json(UPDATE_SUCCESS, { message: 'AccountType Updated', data: save.get() });

      // History On Finish Function
      res.on('finish', async () => {
        History.create('AccountType Updated', req, ObjectName.ACCOUNT, id);
      });

    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, { message: err.message });
    }
  }

  static async get(req, res) {
    try {
      const { id } = req.params;
      const company_id = Request.GetCompanyId(req);

      if (!id) {
        return res.json(400, { message: 'Invalid Id' });
      }

      const AccountTypeData = await AccountType.findOne({
        where: {
          id: id,
          company_id: company_id,
        },
      });

      if (!AccountTypeData) return res.json(200, { message: 'No Records Found' });

      res.json(200, AccountTypeData);
    } catch (err) {
      console.log(err);
    }
  }

  static async delete(req, res, next) {
    let id = req.params.id;

    try {
      //get company Id from request
      const companyId = Request.GetCompanyId(req);

      //validate Order Id exist or not
      if (!id) {
        return res.json(400, { message: 'AccountType Not Found' });
      }

      //delete Order
      await AccountType.destroy({ where: { id: id, company_id: companyId } });

      res.json(200, { message: 'AccountType Deleted' });

      // History On Finish Function
      res.on('finish', async () => {
        History.create('AccountType Deleted', req, ObjectName.ACCOUNT, id);
      });

    } catch (err) {
      console.log(err);
    }
  }
  static async list(params, companyId) {
    try {
      const where = {};

      where.company_id = companyId;

      let statusValue = !isKeyAvailable(params, "status") ? Status.ACTIVE : isKeyAvailable(params, "status") && Number.isNotNull(params?.status) ? params?.status : null;
      let defaultValue = isKeyAvailable(params, "defaultValue") && Number.isNotNull(params?.defaultValue) ? params?.defaultValue : null
      where[Op.or] = [
        { status: { [Op.or]: [statusValue, null] } },
        { id: { [Op.or]: [defaultValue, null] } }
      ]

      const query = {
        order: [["name", "ASC"]],
        where,
      };

      const results = await AccountTypeModal.find(query);

      const data = [];

      for (const accountTypeData of results) {
        data.push({
          value: accountTypeData.id,
          label: accountTypeData.name,
          id: accountTypeData.id,
          category: accountTypeData.category

        });
      }

      return data;
    } catch (err) {
      console.log(err);
      throw { err: err };
    }
  }

  static async getAccountTypeByCategory(params, whereCondition={}) {
    let { category, companyId } = params;
    try {
      const where = {
        ...whereCondition
      };

      where.company_id = companyId;

      where.status = Status.ACTIVE;

      where.category = category

      const query = {
        order: [["name", "ASC"]],
        where,
      };

      const results = await AccountTypeModal.find(query);

      const accountTypeIds = results && results.length > 0 ? results.map(value => value.id) : []

      return accountTypeIds;
    } catch (err) {
      console.log(err);
      throw { err: err };
    }
  }
}

module.exports = AccountTypeService;
