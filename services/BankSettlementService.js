const { Op, Sequelize } = require("sequelize");
const ObjectName = require("../helpers/ObjectName");
const {
  BAD_REQUEST,
  OK,
  UPDATE_SUCCESS,
  DELETE_SUCCESS,
} = require("../helpers/Response");
const DateTime = require("../lib/dateTime");
const Request = require("../lib/request");
const History = require("./HistoryService");
const ObjectHelper = require("../helpers/ObjectHelper");
const { BankSettlement } = require("../db").models;

class BankSettlementService {
  static async create(req, res, next) {
    let data = req?.body;

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
      res.json(400, { message: "CompanyId Not Found" });
    }

    let createData = {
      date: DateTime.GetCurrentDateTime(data?.date),
      amount: data?.amount,
      company_id: companyId,
    };

    await BankSettlement.create(createData).then((response) => {
      res.json(200, { message: "BankSettlement Created" });
      History.create(
        "BankSettlement Created",
        req,
        ObjectName.BANK_SETTLEMENT,
        response.id
      );
    });
  }

  static async search(req, res, next) {
    const companyId = Request.GetCompanyId(req);

    let { page, pageSize, search, sort, sortDir, pagination, showTotal } = req?.query;

    let timeZone = Request.getTimeZone(req);

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: "Invalid page" });
    }
    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    if (!companyId) {
      return res.json(400, { message: "Company Not Found" });
    }
    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      date: "date",
      amount: "amount",
      id: "id",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "date";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort message by ${sortParam}`,
      });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }
    const where = {};

    const searchTerm = search ? search.trim() : null;

    if (searchTerm) {
      where[Op.or] = [
        Sequelize.where(Sequelize.cast(Sequelize.col("amount"), "TEXT"), {
          [Op.iLike]: `%${searchTerm}%`,
        }),
        Sequelize.where(Sequelize.cast(Sequelize.col("date"), "TEXT"), {
          [Op.iLike]: `%${searchTerm}%`,
        }),
      ];
    }

    const query = {
      order: [[sortableFields[sortParam], sortDirParam]],
      where,
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    // Total Amount
    let totalAmount = await BankSettlement.sum("amount", {
      where: {
        company_id: companyId,
      },
    });

    try {
      const BankSettlementList = await BankSettlement.findAndCountAll(query);

      if (BankSettlementList.count === 0) {
        return res.json({});
      }
      const data = [];

      for (let i = 0; i < BankSettlementList.rows.length; i++) {
        const Values = BankSettlementList.rows[i];

        const { id, date, amount } = Values?.get();

        data.push({
          id: id,
          amount: amount,
          date: DateTime.getDateTimeByUserProfileTimezone(date, timeZone),
        });
      }

      if (showTotal) {
        let lastRecord = ObjectHelper.createEmptyRecord(data[0]);
        lastRecord.amount = totalAmount || "";
        data.push(lastRecord);
      }

      res.json(OK, {
        totalCount: BankSettlementList && BankSettlementList?.count,
        currentPage: page,
        pageSize,
        data,
        search,
      });
    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, { message: err.message });
    }
  }

  static async update(req, res) {
    try {
      const companyId = Request.GetCompanyId(req);
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        return res.json(BAD_REQUEST, {
          message: "Bank Settlement id is required",
        });
      }

      const details = await BankSettlement.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!details) {
        return res.json(BAD_REQUEST, {
          message: "Bank Settlement Detail Not Found",
        });
      }
      const updateData = {
        date: data?.date,
        amount: data?.amount,
      };

      await BankSettlement.update(updateData, {
        where: { id: id, company_id: companyId },
      });

      res.on("finish", async () => {
        History.create(
          "Bank Settlement Updated",
          req,
          ObjectName.BANK_SETTLEMENT,
          id
        );
      });

      return res.json(UPDATE_SUCCESS, {
        message: "Bank Settlement Updated",
        data: data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    let companyId = Request.GetCompanyId(req);

    try {
      if (!id) {
        return res.json(BAD_REQUEST, {
          message: "Bank Settlement id is required",
        });
      }

      const BannkSettlementDetail = await BankSettlement.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!BannkSettlementDetail) {
        return res.json(BAD_REQUEST, { message: "Bank Settlement not found" });
      }

      await BannkSettlementDetail.destroy();

      res.on("finish", async () => {
        History.create(
          "Bank Settlement deleted",
          req,
          ObjectName.BANK_SETTLEMENT,
          id
        );
      });

      res.json(DELETE_SUCCESS, { message: "Bank Settlement deleted" });
      // API response
    } catch (err) {
      console.log(err);
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;
      let company_id = Request.GetCompanyId(req);

      // Validate brand id
      if (!id) {
        return res.json(BAD_REQUEST, {
          message: "BankSettlement id is required",
        });
      }

      const banlSettlementDetail = await BankSettlement.findOne({
        where: { id: id, company_id: company_id },
      });

      // Validate brand is exist or not
      if (!banlSettlementDetail) {
        return res.json(BAD_REQUEST, { message: "BankSettlement not found" });
      }

      res.json(OK, {
        data: {
          id,
          amount: banlSettlementDetail?.amount
            ? banlSettlementDetail?.amount
            : "",
          date: banlSettlementDetail?.date ? banlSettlementDetail?.date : "",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = BankSettlementService;
