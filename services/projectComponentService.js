const ObjectName = require("../helpers/ObjectName");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { BAD_REQUEST, OK, UPDATE_SUCCESS } = require("../helpers/Response");
const Projects = require("../helpers/Project.js")
const { Op, Sequelize } = require("sequelize");
const Number = require("../lib/Number.js")
// Models
const { ProjectComponent, Project } = require("../db").models;

const create = async (req, res) => {

  try {
    //get company Id from request
    let data = req.body;

    const company_id = Request.GetCompanyId(req);

    const projectComponentExist = await ProjectComponent.findOne({
      where: { name: data.name, project_id: data.projectId, company_id: company_id },
    });

    if (projectComponentExist) {
      return res.json(BAD_REQUEST, { message: "Project Component already exist" });
    }

    let projectComponentCreateData = {
      company_id: company_id,
      project_id: data.projectId,
      name: data.name,
      status: data.status,
    };

    let projectComponentDetails = await ProjectComponent.create(projectComponentCreateData);

    res.json(200, {
      message: "Project Added",
      projectComponentDetails: projectComponentDetails,
    });

    res.on("finish", () => {
      // Create system log for sprint creation
      History.create("Project Component", req, ObjectName.PROJECT_COMPONENT, projectComponentDetails.id);
    });

  }
  catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};


const Get = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Get the company Id
    const company_id = Request.GetCompanyId(req);

    if (!id) {
      return res.json(400, { message: "Invalid Id" });
    }
    const componentDetail = await ProjectComponent.findOne({
      where: {
        id: id,
        company_id: company_id,
      },
    });

    if (!componentDetail) return res.json(200, { message: "No Records Found" });

    let data = {
      id: componentDetail && componentDetail.id,
      name: componentDetail && componentDetail.name,
      project_id: componentDetail && componentDetail.project_id,
      status: componentDetail.status,

    };

    res.json(OK, { data: data })
  } catch (err) {
    next(err);
    console.log(err);
  }
}

const update = async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  const companyId = Request.GetCompanyId(req)
  const name = data.name;
  try {
    const componentData = await ProjectComponent.findOne({
      where: { id, company_id: companyId },
    });

    if (!componentData) {
      return res.json(400, { message: "Project Component Not Found" });
    }
    //update sprint details
    const projectComponentDetails = {
      id: data?.id,
      name: data?.name,
      project_id: data?.project_id,
      status: data.status === Projects.STATUS_ACTIVE_VALUE ? Projects.STATUS_ACTIVE_VALUE : Projects.STATUS_INACTIVE_VALUES,
    };
    const updateComponentData = await ProjectComponent.update(projectComponentDetails, {
      where: { id: id, company_id: companyId },
    });


    // API response
    res.json(UPDATE_SUCCESS, { message: "Ticket Type Updated", updateComponentData })

    // History On Finish Function
    res.on(("finish"), async () => {
      History.create("Ticket Type Updated", req, ObjectName.PROJECT_COMPONENT, id);
    })

  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message, })
  }
};


const del = async (req, res) => {

  try {

    // Get company Id from request
    let projectComponentId = req.params.id;

    // Get company Id from request
    const companyId = Request.GetCompanyId(req);

    // Validate sprint Id exist or not
    if (!projectComponentId) {
      return res.json(400, { message: "Project Component id is required" });
    }

    // Delete sprint
    await ProjectComponent.destroy({ where: { id: projectComponentId, company_id: companyId } });

    res.json(200, { message: "Project Component Deleted" });

    // History On Finish Function
    res.on(("finish"), async () => {
      History.create("Project Component Deleted", req, ObjectName.PROJECT_COMPONENT, projectComponentId);
    })

  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
}


const search = async (req, res, next) => {
  try {

    let { page, pageSize, search, sort, sortDir, pagination, projectId, status } = req.query;

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

    const companyId = req.user && req.user.company_id;

    if (!companyId) {
      return res.json(400, { message: "Company Not Found" });
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      name: "name",
      status: "status",
      sort: "sort",
      created_at: "created_at",
      updated_at: "updated_at",
      deleted_at: "deleted_at",
      project_id: "project_id",
    };

    const sortParam = sort || "name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }

    const where = {};

    where.company_id = companyId;

    if (Number.isNotNull(projectId)) {
      where.project_id = projectId
    }

    if (Number.isNotNull(status)) {
      where.status = status
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

    const query = {
      order: [[sortableFields[sortParam], sortDirParam]],
      where,
      include: [
        {
          required: true,
          model: Project,
          as: "projectDetail",
        },
      ]
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    // Get sprint list and count
    const projectComponentDetails = await ProjectComponent.findAndCountAll(query);

    // Return sprint is null
    if (projectComponentDetails.count === 0) {
      return res.json({});
    }

    const componentData = [];

    projectComponentDetails.rows.forEach((projectComponent) => {
      componentData.push({
        id: projectComponent.id,
        name: projectComponent.name,
        status: projectComponent.status == Projects.STATUS_ACTIVE_VALUE ? Projects.STATUS_ACTIVE : Projects.STATUS_INACTIVE,
        statusId : projectComponent.status,
      });
    });

    res.json(OK, {
      totalCount: projectComponentDetails.count,
      currentPage: page,
      pageSize,
      data: componentData,
      search,
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}




module.exports = {
  create,
  update,
  del,
  Get,
  search,
  // updateByStatus
};

