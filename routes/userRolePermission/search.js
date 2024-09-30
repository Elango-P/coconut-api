// import service
const {
  userRolePermissionService,
} = require("../../services/UserRolePermissionService");
const { defaultDateFormat } = require("../../lib/utils");
const { Op } = require("sequelize");
const Request = require("../../lib/request");
async function search(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination, role_id } =
      req.query;
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.status(400).send({ message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.status(400).send({ message: "Invalid page size" });
    }

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      role_permission: "role_permission",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "role_permission";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.send(400, { message: `Unable to sort tag by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.send(400, { message: "Invalid sort order" });
    }
    const companyId = Request.GetCompanyId(req)

    const where = {};

    if (role_id) {
      where.role_id = role_id;
    }
    where.company_id = companyId
    // Search by term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where.$or = [
        {
          role_permission: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const query = {
      order: [[sortParam, sortDirParam]],
      where,
      attributes: { exclude: ["deletedAt"] },
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }
    // Get list and count
    userRolePermissionService
      .findAndCount(query)
      .then((results) => {
        // Return null
        if (results.count === 0) {
          return res.send(204, null);
        }

        const data = [];
        results.rows.forEach((rolePermissionData) => {
          data.push({
            id: rolePermissionData.id,
            role_permission: rolePermissionData.role_permission,
            createdAt: defaultDateFormat(rolePermissionData.createdAt),
            updatedAt: defaultDateFormat(rolePermissionData.updatedAt),
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

module.exports = search;
