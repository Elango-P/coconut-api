const { TransferTypeReason } = require("../db").models;

const Request = require("../lib/request");

const DataBaseService = require("../lib/dataBaseService");

const History = require("./HistoryService");

const ObjectName = require("../helpers/ObjectName");

const { BAD_REQUEST, UPDATE_SUCCESS } = require("../helpers/Response");

const TransferTypeReasonModal = new DataBaseService(TransferTypeReason);

const Boolean = require("../lib/Boolean");
const { Op } = require("sequelize");

class ReasonService {
  static async create(req, res) {
    try {
      const data = req.body;

      const companyId = Request.GetCompanyId(req);

      const createData = {
        name: data.reason,
        company_id: companyId,
        transfer_type: data.transferType,
      };
      await TransferTypeReason.create(createData);

      res.json(200, { message: "TransferTypeReason Added" });
    } catch (err) {
      console.log(err);
    }
  }

  static async search(req, res) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination, transferType } =
        req.query;
      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.send(400, { message: "Invalid page" });
      }
      const company_id = Request.GetCompanyId(req);
      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.send(400, { message: "Invalid page size" });
      }

      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        name: "name",
        id: "id",
      };

      const sortParam = sort || "name";
      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.send(400, {
          message: `Unable to sort TransferTypeReason by ${sortParam}`,
        });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(400, { message: "Invalid sort order" });
      }

      const where = {};

      where.company_id = company_id;

      if (transferType) {
        where.transfer_type = transferType;
      }

      const query = {
        where,
        order: [[sortParam, sortDirParam]],
        attributes: { exclude: ["deletedAt"] },
      };

      if (Boolean.get(pagination)) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
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

      // Get list and count
      TransferTypeReasonModal.findAndCount(query)
        .then((results) => {
          const data = [];
          results.rows.forEach((reason) => {
            data.push({
              id: reason.id,
              name: reason.name,
            });
          });

          res.send({
            totalCount: results.count,
            currentPage: page,
            pageSize,
            data,
          });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      console.log(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;

    try {
      const data = req.body;
      const name = data.reason;

      const isReasonexist = await TransferTypeReasonModal.findOne({
        where: { id },
      });

      //update TransferType details
      const TransferTypeDetails = {
        name: name,
      };
      const save = await isReasonexist.update(TransferTypeDetails);

      // API response
      res.json(UPDATE_SUCCESS, {
        message: "TransferTypeReason Updated",
        data: save.get(),
      });

      // History On Finish Function
      res.on("finish", async () => {
        History.create(
          "TransferTypeReason Updated",
          req,
          ObjectName.TRANSFER_TYPE_REASON,
          id
        );
      });
    } catch (err) {
      console.log(err);
      //create a log
      res.json(BAD_REQUEST, { message: err.message });
    }
  }

  static async delete(req, res, next) {
    let id = req.params.id;
    try {
      //get company Id from request
      const companyId = Request.GetCompanyId(req);

      //validate Order Id exist or not
      if (!id) {
        return res.json(400, { message: "TransferTypeReason Not Found" });
      }

      //delete Order
      await TransferTypeReason.destroy({
        where: { id: id, company_id: companyId },
      });

      res.json(200, { message: "TransferTypeReason Deleted" });

      // History On Finish Function
      res.on("finish", async () => {
        History.create(
          "TransferTypeReason Deleted",
          req,
          ObjectName.TRANSFER_TYPE_REASON,
          id
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ReasonService;
