const { Op } = require('sequelize');
const { BAD_REQUEST } = require('../../helpers/Response');
const DateTime = require('../../lib/dateTime');
const Request = require('../../lib/request');
const String = require('../../lib/string');
const { UserSalary, User } = require('../../db').models;
const Date = require('../../lib/dateTime');
const Boolean = require('../../lib/Boolean');
const validator = require('../../lib/validator');

async function list(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    let data = req.query
    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }

    const companyId = Request.GetCompanyId(req);

    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      user: 'user',
      start_date: 'start_date',
      end_date: 'end_date',
      house_rent_allowance: 'house_rent_allowance',
      conveyance_allowance: 'conveyance_allowance',
      medical_reimbursement: 'medical_reimbursement',
      telephone_reimbursement: 'telephone_reimbursement',
      leave_travel_allowance: 'leave_travel_allowance',
      special_allowance: 'special_allowance',
      medical_insurance_premium: 'medical_insurance_premium',
      provident_fund_users: 'provident_fund_users',
      provident_fund_user: 'provident_fund_user',
      user_contribution: 'user_contribution',
      gratuity: 'gratuity',
      annual_bonus: 'annual_bonus',
      ctc: 'ctc',
      created_at: 'created_at',
      updated_at: 'updated_at',
    };

    const sortParam = sort || 'created_at';

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort salary by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
    }

    const where = {};

    where.company_id = companyId;

    if (data.user_id) {
      where.user_id = data.user_id
    }


    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          '$user.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const query = {
      attributes: { exclude: ['deletedAt'] },
      order: [[sortParam, sortDirParam]],
      where,
      include: [
        {
          required: true,
          model: User,
          as: 'user',
          attributes: ["name", "last_name", "media_url"],
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
    const dateTime = new DateTime();

    const getUserSalaryList = await UserSalary.findAndCountAll(query);

    const userSalaryData = [];

    getUserSalaryList.rows.forEach(async (values) => {
      let { user } = values.get();
      const userSalaryList = { ...values.get() };


      const data = {
        id: userSalaryList.id,
        user: String.concatName(user.name, user.last_name),
        first_name: user.name,
        last_name: user.last_name,
        image_url: user.media_url,
        start_date: Date.Format(userSalaryList.start_date),
        end_date: Date.Format(userSalaryList.end_date),
        ctc: userSalaryList.ctc,
        house_rent_allowance: userSalaryList.house_rent_allowance,
        conveyance_allowance: userSalaryList.conveyance_allowance,
        medical_reimbursement: userSalaryList.medical_reimbursement,
        telephone_reimbursement: userSalaryList.telephone_reimbursement,
        leave_travel_allowance: userSalaryList.leave_travel_allowance,
        special_allowance: userSalaryList.special_allowance,
        medical_insurance_premium: userSalaryList.medical_insurance_premium,
        provident_fund_users: userSalaryList.provident_fund_users,
        provident_fund_user: userSalaryList.provident_fund_user,
        user_contribution: userSalaryList.user_contribution,
        gratuity: userSalaryList.gratuity,
        annual_bonus: userSalaryList.annual_bonus,
        company_id: companyId,

      };
      userSalaryData.push(data);
    });

    return res.json(200, {
      totalCount: getUserSalaryList.count,
      currentPage: page,
      pageSize,
      data: userSalaryData,
      sort,
      search,
      sortDir,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = list;
