// const Rating = require("../db/models/Rating");
const { Op, Sequelize } = require("sequelize");
const ObjectName = require("../helpers/ObjectName");
const { OK, BAD_REQUEST, UPDATE_SUCCESS } = require("../helpers/Response");
const DataBaseService = require("../lib/dataBaseService");
const Request = require("../lib/request");
const { defaultDateFormat } = require("../lib/utils");
const History = require("../services/HistoryService");
const { Rating, RatingType } = require("../db").models;
const RatingModal = new DataBaseService(Rating);

class AccountRatingService {
  // Create
  static async create(req, res) {
    try {
      let data = req.body;
      const companyId = Request.GetCompanyId(req);

      const createData = {
        rating_tag_id: data?.type,
        rating: data?.rating,
        comment: data?.comment,
        account_id: data?.vendorId,
        company_id: companyId,
      };

      let Detail = await RatingModal.create(createData);

      res.send(201, {
        message: "Rating Created",
      });
      res.on("finish", async () => {
        History.create("Rating Created", req, ObjectName.ACCOUNT_RATING, Detail.id);
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

      await Rating.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'Rating Deleted' });

      res.on('finish', async () => {
        History.create('Rating Deleted', req, ObjectName.ACCOUNT_RATING, id);
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
        return res.json(BAD_REQUEST, { message: 'Rating id is required' });
      }

      const accountRatingDetail = await Rating.findOne({
        where: { id: id, company_id: companyId },
      });


      if (!accountRatingDetail) {
        return res.json(BAD_REQUEST, { message: 'Rating not found' });
      }

      const data = {
        id,
        account_id: accountRatingDetail.account_id,
        rating_tag_id: accountRatingDetail?.rating_tag_id, // Safely access the name property of typeData
        rating: accountRatingDetail?.rating,
        comment: accountRatingDetail?.comment,
      };
      res.json(OK, { data: data });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  // Update
  static async update(req, res) {
    const { type, rating, comment, vendorId } = req.body;
    const { id } = req.params;

    try {
      const companyId = Request.GetCompanyId(req);
      if (!id) {
        return res.json(BAD_REQUEST, {
          message: "Rating id is required",
        });
      }

      const accountRatingDetail = await RatingModal.findOne({
        where: { id: id, company_id: companyId },
      });

      if (!accountRatingDetail) {
        return res.json(BAD_REQUEST, {
          message: "Invalid Rating id",
        });
      }

      const updateData = {};

      if (id) {
        updateData.id = id;
      }

      if (vendorId) {
        updateData.account_id = vendorId;
      }

      if (type) {
        updateData.rating_tag_id = type;
      }

      if (rating) {
        updateData.rating = rating;
      }

      if (comment) {
        updateData.comment = comment;
      }

      const data = await RatingModal.update(updateData, {
        where: { company_id: companyId, id: id },
      });

      // History On Finish Function
      res.on("finish", async () => {
        History.create("Rating Updated", req, ObjectName.ACCOUNT_RATING, id);
      });

      return res.json(UPDATE_SUCCESS, {
        message: "Rating Updated",
        data: data,
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  //search
  static async search(req, res, next) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination, account_id } =
        req.query;

      let accountId = account_id;

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
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        id: "id",
        rating: "rating",
        comment: "comment",
      };

      const sortParam = sort || "name";

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.send(400, { message: `Unable to sort tag by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(400, { message: "Invalid sort order" });
      }

      const where = {};

      where.company_id = company_id;

      where.account_id = accountId;

      // Search by term
      const searchTerm = search ? search.trim() : null;
      if (searchTerm) {
        where[Op.or] = [
          {
            comment: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            '$typeData.name$': {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          Sequelize.where(Sequelize.cast(Sequelize.col("rating"), "TEXT"), {
            [Op.iLike]: `%${searchTerm}%`,
          }),
        ];
      }

      const query = {
        order: [[sortParam, sortDirParam]],
        include: [
          {
            required: false,
            model: RatingType,
            as: "ratingTypeData",
            attributes: ["id", "name"],
          },
        ],
        where,
      };

      if (pagination) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      // Get list and count
      const results = await RatingModal.findAndCount(query);

      const data = [];

      if (results.count === 0) {
        return res.send(200, data);
      }

      for (const ratingData of results.rows) {
        const typeData = ratingData.ratingTypeData; // Extract typeData from ratingData

        data.push({
          id: ratingData.id,
          name: ratingData.name,
          account_id: ratingData?.account_id,
          rating_tag_name: typeData?.name, // Safely access the name property of typeData
          rating_tag_id: typeData?.id, // Safely access the name property of typeData
          rating: ratingData?.rating,
          comment: ratingData?.comment,
          createdAt: defaultDateFormat(ratingData.createdAt),
          updatedAt: defaultDateFormat(ratingData.updatedAt),
        });
      }

      res.send({
        totalCount: results.count,
        currentPage: page,
        pageSize,
        data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    }
  }
}

module.exports = { AccountRatingService };
