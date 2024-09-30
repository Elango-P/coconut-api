// Validator
const validator = require("../../lib/validator");

// Utils
const utils = require("../../lib/utils");

// Models
const { Permission } = require("../../db").models;

// Process Permission
const processPermission = require("./processPermission");

const { Op } = require("sequelize");
const Request = require("../../lib/request");
async function list(req, res, next) {
  try {
    const data = req.query;
    let company_id = Request.GetCompanyId(req);
    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableField = {
      notes: "notes",
      status: "status",
      createdAt: "createdAt",
    };

    let page;
    let pageSize;

    // Sort Field
    const sort = data.sort || "createdAt";
    if (!Object.keys(sortableField).includes(sort)) {
      return next(
        validator.validationError(`Unable to sort permission by ${sort}`)
      );
    }

    // Sort Order
    const sortDir = data.sortDir || "ASC";
    if (!validOrder.includes(sortDir)) {
      return next(validator.validationError("Invalid sort order"));
    }

    const where = {};

    where.company_id = company_id

    // Search by name
    const name = data.name;
    if (name) {
      where.name = { [Op.like]: `%${name}` };
    }

    // Search by display name
    const displayName = data.displayName;
    if (displayName) {
      where.display_name = displayName;
    }

    // Search by terms
    const searchText = data.search;
    if (searchText) {
      where[Op.or] = [
        {
          name: { [Op.like]: `%${searchText}%` },
        },
        {
          display_name: { [Op.like]: `%${searchText}%` },
        },
      ];
    }

    const query = {
      attributes: [
        "id",
        "name",
        "display_name",
        "feature_name",
        "createdAt",
        "updatedAt",
      ],
      where,
      order: [[`${sortableField[sort]}`, `${sortDir}`]],
    };

    // Pagination
    if (data.pagination) {
      page = data.page ? parseInt(data.page, 10) : 1;
      if (isNaN(page)) {
        return next(validator.validationError("Invalid page"));
      }

      pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 10;
      if (isNaN(pageSize)) {
        return next(validator.validationError("Invalid page size"));
      }

      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    const permissionLists = await Permission.findAndCountAll(query);

    if (!permissionLists) {
      return [];
    }

    // To get Permission
    if (permissionLists) {
      const permissions = [];
      permissionLists.rows.forEach((permission) => {
        permissions.push(processPermission(permission));
      });

      if (data.pagination) {
        const { count, currentPage, lastPage, pageStart, pageEnd } =
          utils.getPageDetails(
            permissionLists.count,
            page,
            pageSize,
            permissions.length
          );

        res.json({
          count,
          currentPage,
          lastPage,
          pageStart,
          pageEnd,
          permissions,
        });
      } else {
        res.json({
          permissions,
        });
      }
    }
  } catch (err) {
    console.log(err);
    req.log.error(err);
    next(err);
  }
}
module.exports = list;
