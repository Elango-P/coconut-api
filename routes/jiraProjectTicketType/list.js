const errors = require("restify-errors");
const Sequelize = require("sequelize");
// Utils
const utils = require("../../lib/utils");

// Models
const { JiraProjectTicketType, Project, ProjectTicketType } =
  require("../../db").models;

const processJiraProjectTicketType = require("./processJiraProjectTicketType");

function list(req, res, next) {
  const data = req.query;
  let page;
  let pageSize;

  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    id: "JiraProjectTicketType.id",
    project_id: "JiraProjectTicketType.project_id",
  };

  const sort = data.sort || "id";
  if (!Object.keys(sortableFields).includes(sort)) {
    return next(
      new errors.BadRequestError(
        `Unable to sort jira project ticket type by ${sort}`
      )
    );
  }

  const sortDir = data.sortDir || "ASC";
  if (!validOrder.includes(sortDir)) {
    return next(new errors.BadRequestError("Invalid sort order"));
  }

  const where = {};

  const projectTicketTypeId = data.projectTicketTypeId;
  if (projectTicketTypeId) {
    where.project_ticket_type_id = projectTicketTypeId;
  }

  const project_id = data.projectId;
  if (project_id) {
    where.project_id = `${project_id}`;
  }

  const jiraProjectTicketTypeId = data.jiraProjectTicketTypeId;
  if (jiraProjectTicketTypeId) {
    where.jira_project_ticket_type_id = `${jiraProjectTicketTypeId}`;
  }

  const query = {
    attributes: [
      "id",
      "project_id",
      "project_ticket_type_id",
      "jira_project_ticket_type_id",
    ],
    include: [
      {
        required: false,
        model: Project,
        as: "project",
        attributes: ["id", "name"],
      },
      {
        required: false,
        model: ProjectTicketType,
        as: "projectTicketType",
        attributes: ["id", "name"],
      },
    ],
    where,
    order: [[Sequelize.literal(`${sortableFields[sort]}`), `${sortDir}`]],
  };

  if (data.pagination) {
    page = data.page ? parseInt(data.page, 10) : 1;
    if (isNaN(page)) {
      return next(new errors.BadRequestError("Invalid page"));
    }

    pageSize = data.pageSize ? parseInt(data.pageSize, 10) : 10;
    if (isNaN(pageSize)) {
      return next(new errors.BadRequestError("Invalid page size"));
    }

    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }

  JiraProjectTicketType.findAndCountAll(query)
    .then((jiraProjectTicketTypes) => {
      const jiraProjectTicketTypeList = [];
      jiraProjectTicketTypes.rows.forEach((jiraProjectTicketType) => {
        jiraProjectTicketTypeList.push(
          processJiraProjectTicketType(jiraProjectTicketType)
        );
      });

      if (data.pagination) {
        const { count, currentPage, lastPage, pageStart, pageEnd } =
          utils.getPageDetails(
            jiraProjectTicketTypes.count,
            page,
            pageSize,
            jiraProjectTicketTypeList.length
          );

        res.json({
          count,
          currentPage,
          lastPage,
          pageStart,
          pageEnd,
          jiraProjectTicketTypes: jiraProjectTicketTypeList,
        });
      } else {
        res.json({
          jiraProjectTicketTypes: jiraProjectTicketTypeList,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      req.log.error(err);
      next(err);
    });
}

module.exports = list;
module.exports = list;
