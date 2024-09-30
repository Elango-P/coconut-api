const { Op } = require("sequelize");
const { BAD_REQUEST } = require("../../helpers/Response");
const Request = require("../../lib/request");
const { Inspection, Location, Tag, User } = require("../../db").models;
const Boolean = require("../../lib/Boolean");
const validator = require("../../lib/validator");
const DateTime = require("../../lib/dateTime");
const String = require("../../lib/string");

async function list(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    let timeZone = Request.getTimeZone(req);

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;

    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    const companyId = Request.GetCompanyId(req);

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      type: "type",
      owner: "owner",
      location: "location",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "createdAt";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort customForm by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }

    const where = {};

    let order;

    where.company_id = companyId;

    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          "$locationDetail.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          "$ownerDetail.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          "$tagDetail.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    if (sort == "location") {
      order = [[{ model: Location, as: "locationDetail" }, "name", sortDir]];
    } else if (sort == "type") {
      order = [[{ model: Tag, as: "tagDetail" }, "name", sortDir]];
    } else if (sort == "owner") {
      order = [[{ model: User, as: "ownerDetail" }, "name", sortDir]];
    } else {
      order = [[sortParam, sortDirParam]];
    }

    const query = {
      attributes: { exclude: ["deletedAt"] },
      order: order,
      where,
      include: [
        {
          model: Location,
          as: "locationDetail",
          required: true,
        },
        {
          model: User,
          as: "ownerDetail",
          required: true,
        },
        {
          model: Tag,
          as: "tagDetail",
          required: true,
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

    const inspectionFieldList = await Inspection.findAndCountAll(query);

    const customForm = [];

    for (let i = 0; i < inspectionFieldList.rows.length; i++) {
      const {
        id,
        tag_id,
        owner_id,
        store_id,
        company_id,
        ownerDetail,
        tagDetail,
        locationDetail,
        createdAt,
      } = inspectionFieldList.rows[i];

      let data = {
        id: id,
        tag_id: tag_id,
        owner_id: owner_id,
        store_id: store_id,
        companyId: company_id,
        owner_first_name: ownerDetail?.name,
        owner_last_name: ownerDetail?.last_name,
        media_url: ownerDetail?.media_url,
        ownerName: String.concatName(ownerDetail?.name, ownerDetail?.last_name),
        typeName: tagDetail ? tagDetail.name : "",
        locationName: locationDetail ? locationDetail.name : "",
        createdAt: DateTime.getDateTimeByUserProfileTimezone(
          createdAt,
          timeZone,
          "DD-MMM-YY hh:mm A"
        ),
      };
      customForm.push(data);
    }

    return res.json(200, {
      totalCount: inspectionFieldList.count,
      currentPage: page,
      pageSize,
      data: customForm,
      sort,
      search,
      sortDir,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = list;
