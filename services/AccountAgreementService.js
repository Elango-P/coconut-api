const ObjectName = require('../helpers/ObjectName');
const { OK, BAD_REQUEST, UPDATE_SUCCESS } = require('../helpers/Response');
const DateTime = require('../lib/dateTime');
const Request = require('../lib/request');
const History = require('../services/HistoryService');
const { AccountAgreement } = require('../db').models;

class AccountAgreementService {
  // Create a new AccountAgreementService
  static async create(req, res) {
    try {
      let data = req.body;
      const companyId = Request.GetCompanyId(req);

      const agreementNumber = async (companyId) => {
        try {
          let detail = await AccountAgreement.findOne({
            order: [['id', 'DESC']],
            where: { company_id: companyId, account_id: data?.vendorId },
          });

          if (detail) {
            return detail && parseInt(detail.agreement_number) + 1;
          } else {
            return 1;
          }
        } catch (err) {
          console.log(err);
        }
      };

      const createData = {
        date: data.date,
        agreement_start_date: data.agreement_start_date,
        agreement_end_date: data?.agreement_end_date,
        agreement_renewal_date: data?.agreement_renewal_date,
        agreement_term: data?.agreement_term,
        account_id: data?.vendorId,
        company_id: companyId,
        agreement_number: await agreementNumber(companyId),
      };

      const detail = await AccountAgreement.create(createData);

      res.on("finish", async () => {
        let historyMessage = [];
        historyMessage.push(
          `Agreement Start Date: ${DateTime.shortMonthDate(
            data.agreement_start_date
          )}\n`
        );
        if (data?.agreement_end_date)
          historyMessage.push(
            `Agreement End Date: ${DateTime.shortMonthDate(
              data.agreement_end_date
            )}\n`
          );
        if (data?.agreement_renewal_date)
          historyMessage.push(
            `Agreement Renewal Date: ${DateTime.shortMonthDate(
              data.agreement_renewal_date
            )}\n`
          );
        historyMessage.push(`Agreement Term: ${data.agreement_term}\n`);

        let message = historyMessage.join("");
        History.create(message, req, ObjectName.ACCOUNT_AGREEMENT, detail.id);
      });

      res.json(OK, {
        message: "Account Agreement added",
        id: detail?.id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  // delete

  static async del(req, res) {
    try {
      const id = req.params.id;
      const company_id = Request.GetCompanyId(req);

      await AccountAgreement.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'Account Agreement Deleted' });

      res.on('finish', async () => {
        History.create('Account Agreement Deleted', req, ObjectName.ACCOUNT, id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  //get
  static async get(req, res, next) {
    try {
      const { id } = req.params;
      let companyId = Request.GetCompanyId(req);

      if (!id) {
        return res.json(BAD_REQUEST, { message: 'Account Agreement id is required' });
      }

      const accountAgreementDetail = await AccountAgreement.findOne({
        where: { id: id, company_id: companyId },
      });

      if (!accountAgreementDetail) {
        return res.json(BAD_REQUEST, { message: 'Account Agreement not found' });
      }

      const data = {
        id,
        account_id: accountAgreementDetail.account_id,
        date: DateTime.Format(accountAgreementDetail.date),
        agreement_start_date: DateTime.Format(accountAgreementDetail?.agreement_start_date),
        agreement_end_date: DateTime.Format(accountAgreementDetail?.agreement_end_date),
        agreement_renewal_date: DateTime.Format(accountAgreementDetail?.agreement_renewal_date),
        agreement_term: accountAgreementDetail?.agreement_term,
        agreement_number: accountAgreementDetail?.agreement_number,
      };
      res.json(OK, { data: data });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  // Update
  static async update(req, res) {
    const { agreement_start_date, agreement_end_date, agreement_renewal_date, agreement_term, vendorId } = req.body;
    const { id } = req.params;

    try {
      const companyId = Request.GetCompanyId(req);
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'Account Agreement id is required' });
      }

      const accountAgreementDetail = await AccountAgreement.findOne({
        where: { id: id, company_id: companyId },
      });

      if (!accountAgreementDetail) {
        return res.json(BAD_REQUEST, { message: 'Invalid Account Agreement id' });
      }

      const updateData = {};

      if (id) {
        updateData.id = id;
      }

      if (vendorId) {
        updateData.account_id = vendorId;
      }

      if (agreement_start_date !== undefined && agreement_start_date !== accountAgreementDetail.agreement_start_date) {
        updateData.agreement_start_date = agreement_start_date;
      }

      if (agreement_end_date !== undefined && agreement_end_date !== accountAgreementDetail.agreement_end_date) {
        updateData.agreement_end_date = agreement_end_date;
      }

      if (
        agreement_renewal_date !== undefined &&
        agreement_renewal_date !== accountAgreementDetail.agreement_renewal_date
      ) {
        updateData.agreement_renewal_date = agreement_renewal_date;
      }

      if (agreement_term !== undefined && agreement_term !== accountAgreementDetail.agreement_term) {
        updateData.agreement_term = agreement_term;
      }

      const data = await AccountAgreement.update(updateData, {
        where: { company_id: companyId, id: id },
      });

      res.on('finish', async () => {
        const historyMessage = [];

        if (
          agreement_start_date !== undefined &&
          agreement_start_date !== accountAgreementDetail.agreement_start_date
        ) {
          historyMessage.push(`Agreement Start Date Changed to ${DateTime.shortMonthDate(agreement_start_date)}\n`);
        }

        if (agreement_end_date !== undefined && agreement_end_date !== accountAgreementDetail.agreement_end_date) {
          historyMessage.push(`Agreement End Date Changed to ${DateTime.shortMonthDate(agreement_end_date)}\n`);
        }

        if (
          agreement_renewal_date !== undefined &&
          agreement_renewal_date !== accountAgreementDetail.agreement_renewal_date
        ) {
          historyMessage.push(`Agreement Renewal Date Changed to ${DateTime.shortMonthDate(agreement_renewal_date)}\n`);
        }

        if (agreement_term !== undefined && agreement_term !== accountAgreementDetail.agreement_term) {
          historyMessage.push(`Agreement Term Changed to ${agreement_term}\n`);
        }

        if (historyMessage.length > 1) {
          const message = historyMessage.join('');
          History.create(message, req, ObjectName.ACCOUNT_AGREEMENT, id);
        } else {
          History.create('Account Agreement Updated', req, ObjectName.ACCOUNT_AGREEMENT, id);
        }
      });

      return res.json(UPDATE_SUCCESS, {
        message: 'Account Agreement Updated',
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  //search
  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, account_id } = req.query;

    let accountId = account_id;

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
      agreement_start_date: 'agreement_start_date',
      agreement_end_date: 'agreement_end_date',
      agreement_renewal_date: 'agreement_renewal_date',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const sortParam = sort || 'updatedAt';

    // Validate sortable fields are present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort payments by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
    }

    const where = { company_id: companyId, account_id: accountId };

    // Search by status
    const status = req.query.status;
    if (status) {
      where.status = status;
    }

    const query = {
      order: [[sortParam, sortDirParam]],
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    };

    try {
      const details = await AccountAgreement.findAndCountAll(query);

      if (details.count === 0) {
        return res.json({ message: 'Payment not found' });
      }

      const data = details.rows.map((paymentsValue) => {
        const {
          id,
          account_id,
          agreement_start_date,
          agreement_end_date,
          agreement_renewal_date,
          agreement_number,
          createdAt,
          updatedAt,
        } = paymentsValue.get();

        return {
          id,
          agreement_number,
          agreement_start_date,
          agreement_end_date,
          agreement_renewal_date,
          account_id,
          createdAt: DateTime.defaultDateFormat(createdAt),
          updatedAt: DateTime.defaultDateFormat(updatedAt),
        };
      });

      res.json(OK, {
        totalCount: details.count,
        currentPage: page,
        pageSize,
        data,
        search,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
      res.json(OK, { message: err.message });
    }
  }
}

module.exports = { AccountAgreementService };
