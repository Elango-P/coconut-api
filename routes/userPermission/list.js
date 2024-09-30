const { Op } = require("sequelize");

// Validator
const validator = require("../../lib/validator");

// Utils
const utils = require("../../lib/utils");

// Models
const { UserPermission } = require("../../db").models;

// Process Permission
const processUserPermission = require("./processUserPermission");

async function list(req, res, next) {
  try {
    const data = req.query;

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

    // Search by user Id
    const userId = data.userId;
    if (userId) {
      where.user_id = userId;
    }

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
        "permission_id",
        "name",
        "display_name",
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

    const userPermissionLists = await UserPermission.findAndCountAll(query);

    if (!userPermissionLists) {
      return [];
    }

    // To get Permission
    if (userPermissionLists) {
      const userPermissions = [];
      userPermissionLists.rows.forEach((userPermission) => {
        userPermissions.push(processUserPermission(userPermission));
      });

      if (data.pagination) {
        const { count, currentPage, lastPage, pageStart, pageEnd } =
          utils.getPageDetails(
            userPermissionLists.count,
            page,
            pageSize,
            userPermissions.length
          );

        res.json({
          count,
          currentPage,
          lastPage,
          pageStart,
          pageEnd,
          userPermissions,
        });
      } else {
        res.json({
          userPermissions,
        });
      }
    }
  } catch (err) {
    req.log.error(err);
    next(err);
  }
}

module.exports = list;
