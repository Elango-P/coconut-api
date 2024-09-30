// Get portal list based on company id

// import service
const { portalService } = require("../../services/PortalService");

//Utills
const { defaultDateFormat } = require("../../lib/utils");

//Models
const { Company } = require("../../db").models;

const { Op } = require("sequelize");

async function getList(req, res, next) {
  try {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(400, { message: "Invalid page" });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(400, { message: "Invalid page size" });
    }

    const companyId = req.params.id;

    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      portal_name: "portal_name",
      portal_url: "portal_url",
      template: "template",
      createdAt: "createdAt",
      company_id: "company_id",
      updatedAt: "updatedAt",
    };

    const sortParam = sort ? sort : "portal_name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(400, { message: `Unable to sort tag by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(400, { message: "Invalid sort order" });
    }

    if(!companyId) return res.json(400, {message: "Invalid Company Id"})

    const where = {};

    where.company_id = companyId;

    // Search by term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          portal_name: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        {
          portal_url: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const query = {
      order: [[sortParam, sortDirParam]],
      where,
      include: [
        {
          required: false,
          model: Company,
          attributes: ["company_name"],
          as: "companyData",
        },
      ],
      attributes: { exclude: ["deletedAt"] },
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    // Get list and count
    portalService
      .findAndCount(query)
      .then((results) => {
        // Return null
        if (results.count === 0) {
          return res.send(200, null);
        }

        const data = [];
        results.rows.forEach(async (portalData) => {
          data.push({
            id: portalData.id,
            portalName: portalData.portal_name,
            portalUrl: portalData.portal_url,
            template: portalData.template,
            company:
              portalData.companyData && portalData.companyData.company_name,
            createdAt: defaultDateFormat(portalData.createdAt),
            updatedAt: defaultDateFormat(portalData.updatedAt),
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

module.exports = getList;
