const { Op } = require('sequelize');
const { BAD_REQUEST } = require('../../helpers/Response');
const Request = require('../../lib/request');
const { Tag, AccountEntry } = require('../../db').models;
const DateTime = require('../../lib/dateTime');
const Boolean = require('../../lib/Boolean');
const validator = require('../../lib/validator');


async function search(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination, type, startDate, endDate, tag } = req.query;

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }

    const companyId = Request.GetCompanyId(req);

    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      name: 'name',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const sortParam = sort || 'name';

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
    }

    const where = {};
    const accountEntryWhere={}

    where.company_id = companyId;

    if (type) {
      where.type = type;
    }

    if (tag) {
      where.id = tag;
    }
    
    if (startDate && !endDate) {
      accountEntryWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      accountEntryWhere.date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }
    if (startDate && endDate) {
     accountEntryWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }

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

    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    const getAccountEntryTagList = await Tag.findAndCountAll(query);

    const accountEntryTag = [];

    for (let i = 0; i < getAccountEntryTagList.rows.length; i++) {
      const { id, name, company_id, type } = getAccountEntryTagList.rows[i];
      let amount = await AccountEntry.sum('amount', { where:{...accountEntryWhere,category_tag_id:id,company_id:companyId} });
      let data = {
        id: id,
        name: name,
        type: type,
        companyId: company_id,
        amount: amount,
      };
      accountEntryTag.push(data);
    }

    return res.json(200, {
      totalCount: getAccountEntryTagList.count,
      currentPage: page,
      pageSize,
      data: accountEntryTag,
      sort,
      search,
      sortDir,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = search;
