const ObjectName = require("../helpers/ObjectName");
const Response = require('../helpers/Response');
const { BAD_REQUEST } = require('../helpers/Response');
const Boolean = require('../lib/Boolean');
const Request = require('../lib/request');
const History = require('./HistoryService');
const { Tax, Tag } = require('../db').models;
const Currency = require("../lib/currency");

class TaxService {
  static async create(req, res, next) {
    try {
      const companyId = Request.GetCompanyId(req);

      if (!companyId) {
        res.json(BAD_REQUEST, { message: 'Company Id Required' });
      }
      const data = req.body;
      
      let historyMessage=[]
      let createData = {
        company_id: companyId,
        amount: data?.amount ? data?.amount : null,
        object_name: data?.object_name ? data?.object_name : null,
        tax_type_id: data?.tax_type ? data?.tax_type : null,
        tax_amount: data?.tax_amount ? data?.tax_amount : null,
        object_id: data?.object_id ? data?.object_id : null,
        tax_percentage: data?.tax_percentage ? data?.tax_percentage : null,
      };
      const getTypeName = async (id)=>{
        let typeDetail= await Tag.findOne({where:{
          id:id,
        company_id:companyId
        }});
        return typeDetail && typeDetail?.name
      };
        historyMessage.push(`Amount: ${Currency.IndianFormat(data?.amount)}\n`);
        historyMessage.push(`Tax Type:  ${await getTypeName(data?.tax_type)}\n`);
        historyMessage.push(`Tax Amount: ${Currency.IndianFormat(data?.tax_amount)}\n`);
        historyMessage.push(`Tax Percentage ${data?.tax_percentage}\n`);

      let tax = await Tax.create(createData);

      res.on('finish', async () => {
        if (historyMessage && historyMessage.length > 0) {
          let message = historyMessage.join();
          History.create(message, req, data?.object_name,  data?.object_id);
        } else {
          History.create("Tax Added", req, data?.object_name,  data?.object_id);
        }
      });

      res.json(Response.OK, {
        message: 'Tax Added',
        data: tax,
      });
    } catch (err) {
      console.log(err);
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }

  // update
  static async update(req, res, next) {
    const { id } = req.params;

    let companyId = Request.GetCompanyId(req);
    try {
      const taxExist = await Tax.findOne({
        where: { id },
      });
      const data = req.body;

      const getTypeName = async (id)=>{
        let typeDetail= await Tag.findOne({where:{
          id:id,
        company_id:companyId
        }});
        return typeDetail && typeDetail?.name
      };
      let historyMessage=[]

    const  updateData = {
        object_id: data?.object_id ,
      };

      if  (data?.amount !== taxExist.amount) {
        updateData.amount = data?.amount ? data?.amount : null;
        historyMessage.push(`Amount Updated from ${Currency.IndianFormat(taxExist.amount)} to ${Currency.IndianFormat(data?.amount)}\n`);
      }
      if  (data?.tax_type !== taxExist.tax_type_id) {
        updateData.tax_type_id = data?.tax_type ? data?.tax_type : null;
        historyMessage.push(`Tax Type Updated from ${await getTypeName(taxExist.tax_type_id)} to ${await getTypeName(data?.tax_type)}\n`);
      }
      if  (data?.tax_amount !== taxExist.tax_amount) {
        updateData.tax_amount = data?.tax_amount ? data?.tax_amount : null;
        historyMessage.push(`Tax Amount Updated from ${Currency.IndianFormat(taxExist.tax_amount)} to ${Currency.IndianFormat(data?.tax_amount)}\n`);
      }
     
      if  ( data?.tax_percentage !== taxExist.tax_percentage) {
        updateData.tax_percentage = data?.tax_percentage ? data?.tax_percentage : null;
        historyMessage.push(`Tax Percentage Updated from ${taxExist.tax_percentage} to ${data?.tax_percentage}\n`);
      }
      if (taxExist) {
        const update = await Tax.update(updateData, {
          where: { id },
        });
        res.json(Response.UPDATE_SUCCESS, { message: "Tax Updated", data: update, })
        if (historyMessage && historyMessage.length > 0) {
          let message = historyMessage.join();
          History.create(message, req, data?.object_name,  data?.object_id);
        } else {
          History.create("Tax Updated", req, data?.object_name,  data?.object_id);
        }

      }
    } catch (err) {
      console.log(err);
    }
  }

  //search
  static async search(req, res, next) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination, object_id, object_name } = req.query;
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.send(400, { message: 'Invalid page' });
      }
      const company_id = Request.GetCompanyId(req);
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.send(400, { message: 'Invalid page size' });
      }

      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        id: 'id',
        amount: 'amount',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        tax_percentage: 'tax_percentage',
        tax_amount: 'tax_amount',
        tax_type_id: 'tax_type_id',
      };
      const sortParam = sort || 'updatedAt';
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(BAD_REQUEST, { message: `Unable to sort Tax by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
      if (!validOrder.includes(sortDirParam)) {
        return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
      }
      const where = {};
      if (object_id) {
        where.object_id = object_id;
      }

      if (object_name) {
        where.object_name = object_name;
      }

      where.company_id = company_id;

      const query = {
        where,
        order: [[sortParam, sortDirParam]],
        include: [
          {
            required: false,
            model: Tag,
            as: 'typeData',
          },
        ],
      };

      if (Boolean.get(pagination)) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      // Get list and count
      await Tax.findAndCountAll(query)
        .then((results) => {
          const data = [];
          results.rows.forEach((tax) => {
            data.push({
              id: tax.id,
              taxType: tax.typeData?.name,
              taxAmount: tax?.tax_amount,
              taxPercentage: tax?.tax_percentage,
              object_name: tax?.object_name,
              amount: tax?.amount,
              taxTypeId:tax.typeData?.id
            });
          });
          res.send({
            totalCount: results.count,
            currentPage: page,
            pageSize,
            data,
          });
        })
        .catch((err) => {});
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
            return res.json(400, { message: "Tax Not Found" });
        }

        //delete Order
        await Tax.destroy({ where: { id: id, company_id: companyId } });

        res.json(200, { message: "Tax Deleted" });

        // History On Finish Function
        res.on(("finish"), async () => {
            History.create("Tax Deleted",);
        })
    } catch (err) {
        console.log(err);
    }
}
}
module.exports = TaxService;
