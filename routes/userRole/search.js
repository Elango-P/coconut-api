// import service
const { userRoleService } = require("../../services/UserRoleService");

const { defaultDateFormat } = require("../../lib/utils");
const { Op } = require("sequelize");
     Request = require("../../lib/request");

async function search(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(400, { message: "Invalid page" });
    }

    const company_id = Request.GetCompanyId(req);

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(400, { message: "Invalid page size" });
    }

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id:"id",
      role_name: "role_name",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "role_name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(400, { message: `Unable to sort tag by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(400, { message: "Invalid sort order" });
    }

    const where = {};

    where.company_id = company_id;

    // Search by term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          role_name: {
            [Op.iLike]: `%${searchTerm}%`,
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
    const data = [];

    // Get list and count
    userRoleService
      .findAndCount(query)
      .then((results) => {
        // Return null
        if (results.count === 0) {
          return res.send(200, data);
        }

        results.rows.forEach((userRoleData) => {
          data.push({
            id: userRoleData.id,
            role_name: userRoleData.role_name,
            status: userRoleData.status,
            createdAt: defaultDateFormat(userRoleData.createdAt),
            updatedAt: defaultDateFormat(userRoleData.updatedAt),
          });
        });

        res.send(200, {
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
