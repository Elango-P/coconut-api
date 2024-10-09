const ObjectName = require("../helpers/ObjectName");
const Request = require("../lib/request");
const History = require("./HistoryService");
const Date = require("../lib/dateTime");
const { BAD_REQUEST, UPDATE_SUCCESS , OK } = require("../helpers/Response");
const Projects = require("../helpers/Project.js")
const StatusService = require("../services/StatusService");

const Number = require("../lib/Number");
// Models
const { Op, Sequelize } = require("sequelize");
const { PROJECT_ACTIVE } = require("../lib/constants");
const { ACTIVE,IN_ACTIVE } = require("../helpers/Project.js");
const { STATUS_ACTIVE_VALUE,ACTIVE_STATUS } = require("../helpers/Project.js");
const Status = require("../helpers/Status");
const { isKeyAvailable } = require("../lib/validator.js");

// Models
const { Project ,status,ProjectTicketType ,User} = require("../db").models;

const create = async (req, res) => {

  try {
    //get company Id from request
    let data = req.body;

    const company_id = Request.GetCompanyId(req);

    let query = {
      order: [["createdAt", "DESC"]],
      where: { company_id },
    };

    const projectTicketTypeExist = await ProjectTicketType.findOne({
      where: { name: data.name,company_id:company_id ,project_id:data.projectId},
    });

    if (projectTicketTypeExist) {
      return res.json(BAD_REQUEST, { message: "Ticket Type already exist" });
  }

    let projectTicketTypeCreateData = {
      company_id: company_id,
      name: data.name,
      project_id:data?.projectId,
      role:data?.role,
      type_id:data?.type_id,
      default_story_point: data?.default_story_point,
      update_ticket_id_with_jira_id:data?.update_ticket_id_with_jira_id,
      show_attachment_page_name:data?.show_attachment_page_name,
      show_attachment_platform:data?.show_attachment_platform,
      allow_to_create_parent_ticket:data?.allow_to_create_parent_ticket,
      show_reviewer:data?.allow_to_create_parent_ticket,
      status: Projects.STATUS_ACTIVE_VALUE,
      test_case_creation_time: data?.test_case_creation_time,
      test_case_execution_time:data?.test_case_execution_time,
      show_test_cases: data?.show_test_cases,
      show_tasks: data?.show_tasks,
      show_estimated_hours: data?.show_estimated_hours,
      show_poa: data?.show_poa,
      show_acceptance_criteria: data?.show_acceptance_criteria,
      show_severity: data?.show_severity,
      show_priority: data?.show_priority,
      show_component: data?.show_component,
      show_label: data?.show_label,
      show_affected_version: data?.show_affected_version,
      show_release_version: data?.show_release_version,
      show_sprint: data?.show_sprint,
      show_description: data?.show_description,
      show_applicable_devices: data?.show_applicable_devices,
      show_environment:data?.show_environment,
      show_test_steps: data?.show_test_steps,
      show_actual_results: data?.show_actual_results,
      show_expected_results: data?.show_expected_results,
      show_delivery_date: data?.show_delivery_date,
      show_initial_eta: data?.show_initial_eta,
      show_eta_date: data?.show_eta_date,
      show_eta_time:data?.show_eta_time,
      show_story_points: data?.show_story_points,
      show_jira_ticket_id: data?.show_jira_ticket_id,
      show_parent_ticket_id: data?.show_parent_ticket_id,
      show_user_impact: data?.show_user_impact,
      show_production_status: data?.show_production_status,
      show_production_status_notes: data?.show_production_status_notes,
      show_type:data?.show_type,
      show_build: data?.show_build,
      show_reference_screenshots: data?.show_reference_screenshots,
      show_reporter:data?.show_reporter,
      show_assignee: data.show_assignee,
      show_reviewer: data?.show_reviewer,
      show_project: data?.show_project,
      show_status: data?.show_status,
      show_created_at: data?.show_created_at,
      show_updated_at: data?.show_updated_at,
      show_jira_created_at: data?.show_jira_created_at,
      show_completed_at:data?.show_completed_at,
      show_customer_delivery_date: data?.show_customer_delivery_date,
      show_ticket_id: data?.show_ticket_id,
      type: data?.type,
      sort: data?.sort,
      show_sub_tasks: data?.show_sub_tasks,
      show_jira_assignee: data?.show_jira_assignee,
      company_id:company_id
    };

    let projectDetails = await ProjectTicketType.create(projectTicketTypeCreateData);

    res.json(200, {
      message: "Ticket Type Added",
      projectDetails: projectDetails,
    });

    res.on("finish", () => {
      // Create system log for sprint creation
      History.create("Ticket  Type Added", req, ObjectName.PROJECT_TICKET_TYPE, projectDetails.id);
    });

  }
  catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};




const update = async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  const companyId = Request.GetCompanyId(req)
  const name = data.name;
  let checkBoxValue = data && data?.checkBoxValue && data?.checkBoxValue?.split(",");
  try {
    const projectData = await ProjectTicketType.findOne({
      where: { id, company_id: companyId },
    });

    if (!projectData) {
      return res.json(400, { message: "Ticket Type Not Found" });
    }
    //update sprint details
    const projectDetails = {
      project_id:data?.project_id,
      role:data?.role,
      type_id:data?.type_id,
      update_ticket_id_with_jira_id:data && data.update_ticket_id_with_jira_id === true?1:0 ,
      show_attachment_page_name:data && data.show_attachment_page_name===true?1:0,
      show_attachment_platform:data && data.show_attachment_platform===true?1:0,
      show_attachment_summary:data && data.show_attachment_summary === true?1:0,
      allow_to_create_parent_ticket:data && data.allow_to_create_parent_ticket,
      show_reviewer:data && data.allow_to_create_parent_ticket === true?1:0,
      test_case_creation_time: data && data.show_test_case_creation_time ===true? 1:0,
      test_case_execution_time:data && data.show_test_case_execution_time === true?1:0,
      show_test_cases: data && data.show_test_cases === true?1:0,
      show_tasks:data && data.show_tasks===true?1:0,
      show_estimated_hours: data && data.show_estimated_hours === true?1:0,
      show_poa: data && data.show_poa ===true?1:0,
      show_acceptance_criteria: data.show_acceptance_criteria === true?1:0,
      show_severity: data && data.show_severity === true?1:0,
      show_priority: data &&data.show_priority === true?1:0,
      show_component: data && data.show_component === true?1:0,
      show_label: data && data.show_label === true?1:0,
      show_affected_version: data && data.show_affected_version === true?1:0,
      show_release_version: data && data.show_release_version === true?1:0,
      show_sprint: data && data.show_sprint === true?1:0,
      show_description:data &&  data.show_description === true?1:0,
      show_applicable_devices: data && data.show_applicable_devices === true?1:0,
      show_environment:data && data.show_environment === true?1:0,
      show_test_steps: data && data.show_test_steps === true?1:0,
      show_actual_results: data && data.show_actual_results === true?1:0,
      show_expected_results: data && data.show_expected_results===true?1:0,
      show_delivery_date:data && data.show_delivery_date=== true?1:0,
      show_initial_eta: data && data.show_initial_eta === true?1:0,
      show_eta_date: data && data.show_eta_date===true?1:0,
      show_eta_time:data && data.show_eta_time===true?1:0,
      show_story_points: data && data.show_story_points===true?1:0,
      show_jira_ticket_id: data && data.show_jira_ticket_id===true?1:0,
      show_parent_ticket_id: data && data.show_parent_ticket_id===true?1:0,
      show_user_impact: data && data.show_user_impact===true?1:0,
      show_production_status: data && data.show_production_status === true?1:0,
      show_production_status_notes: data && data.show_production_status_notes === true?1:0,
      show_type:data && data.show_type === true?1:0,
      show_build: data && data.show_build===true?1:0,
      show_reference_screenshots: data && data.show_reference_screenshots===true?1:0,
      show_reporter:data && data.show_reporter=== true?1:0,
      show_assignee: data.show_assignee ===true ?1 :0,
      show_reviewer: data && data.show_reviewer===true?1:0,
      show_project: data && data.show_project===true?1:0,
      show_status: data && data.show_status===true?1:0,
      show_created_at: data && data.show_created_at===true?1:0,
      show_updated_at: data && data.show_updated_at===true?1:0,
      show_jira_created_at: data && data.show_jira_created_at === true?1:0,
      show_completed_at:data && data.show_completed_at === true?1:0,
      show_customer_delivery_date: data && data.show_customer_delivery_date === true?1:0,
      show_ticket_id: data && data.show_ticket_id === true?1:0,
      type: data && data.type,
      show_sub_tasks: data && data.show_sub_tasks === true?1:0,
      show_jira_assignee: data && data.show_jira_assignee === true?1:0,
    };

    if(Object.keys(data).includes("name")){
      projectDetails.name = data?.name
    }
    if(Object.keys(data).includes("status")){
      projectDetails.status = data.status
    }
    if(Object.keys(data).includes("sort")){
      projectDetails.sort =  data && data.sort
    }

    if(Object.keys(data).includes("default_story_point")){
      projectDetails.default_story_point =  data?.default_story_point
    }
    if(Object.keys(data).includes("sub_task_ticket_types")){
      projectDetails.sub_task_ticket_types =  data && data?.sub_task_ticket_types ? data?.sub_task_ticket_types?.join(",") :null
    }

    if(Object.keys(data).includes("checkBoxValue")){
      projectDetails.fields =  checkBoxValue && checkBoxValue.join(",")
    }
    if(Object.keys(data).includes("fine_type")){
      projectDetails.fine_type = data?.fine_type ? data?.fine_type?.value : null
    }


    const save = await ProjectTicketType.update(projectDetails, {
      where: { id: id, company_id: companyId },
    });


    // API response
    res.json(UPDATE_SUCCESS, { message: "Ticket Type Updated" })

    // History On Finish Function
    res.on(("finish"), async () => {
      History.create("Ticket Type Updated", req, ObjectName.PROJECT_TICKET_TYPE, id);
    })

  } catch (err) {
    //create a log
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message, })
  }
};



// Models

const del = async (req, res) => {

  try {

    // Get company Id from request
    let projectTicketTypeId = req.params.id;

    // Get company Id from request
    const companyId = Request.GetCompanyId(req);

    // Validate sprint Id exist or not
    if (!projectTicketTypeId) {
      return res.json(400, { message: "Project Ticket Type id is required" });
    }

    // Delete sprint
    await ProjectTicketType.destroy({ where: { id: projectTicketTypeId, company_id: companyId } });

    res.json(200, { message: "Project Ticket Type Deleted" });

    // History On Finish Function
    res.on(("finish"), async () => {
      History.create("Project Ticket Type Deleted", req, ObjectName.PROJECT_TICKET_TYPE, 
      
   projectTicketTypeId
      
      );
    })

  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
}

const Get = async(req, res, next) => {
  const { id } = req.params;

  try {
    // Get the company Id
    const company_id = Request.GetCompanyId(req);

    if (!id) {
      return res.json(400, { message: "Invalid Id" });
    }
    const projectTicketTypeDetail = await ProjectTicketType.findOne({
      where: {
        id: id,
        company_id: company_id,
      },
    });

    if (!projectTicketTypeDetail) return res.json(200, { message: "No Records Found" });
    let data = {
      id:projectTicketTypeDetail && projectTicketTypeDetail.id,
      name: projectTicketTypeDetail && projectTicketTypeDetail.name,
      project_id:projectTicketTypeDetail && projectTicketTypeDetail.project_id,
      role:projectTicketTypeDetail && projectTicketTypeDetail.role,
      type_id:projectTicketTypeDetail && projectTicketTypeDetail.type_id,
      update_ticket_id_with_jira_id:projectTicketTypeDetail && projectTicketTypeDetail.update_ticket_id_with_jira_id===1?true:false,
      show_attachment_page_name:projectTicketTypeDetail && projectTicketTypeDetail.show_attachment_page_name===1?true:false,
      show_attachment_platform:projectTicketTypeDetail && projectTicketTypeDetail.show_attachment_platform===1?true:false,
      show_attachment_summary:projectTicketTypeDetail&& projectTicketTypeDetail.show_attachment_summary===1?true:false,
      allow_to_create_parent_ticket:projectTicketTypeDetail && projectTicketTypeDetail.allow_to_create_parent_ticket,
      show_test_case_creation_time: projectTicketTypeDetail && projectTicketTypeDetail.test_case_creation_time===1?true:false,
      show_test_case_execution_time:projectTicketTypeDetail && projectTicketTypeDetail.test_case_execution_time===1?true:false,
      show_test_cases: projectTicketTypeDetail && projectTicketTypeDetail.show_test_cases===1?true:false,
      show_tasks: projectTicketTypeDetail && projectTicketTypeDetail.show_tasks === 1 ?true:false,
      show_estimated_hours: projectTicketTypeDetail && projectTicketTypeDetail.show_estimated_hours===1?true:false,
      show_poa: projectTicketTypeDetail && projectTicketTypeDetail.show_poa === 1?true:false,
      show_acceptance_criteria: projectTicketTypeDetail && projectTicketTypeDetail.show_acceptance_criteria===1?true:false,
      show_severity: projectTicketTypeDetail && projectTicketTypeDetail.show_severity===1?true:false,
      show_priority: projectTicketTypeDetail && projectTicketTypeDetail.show_priority===1?true:false,
      show_component: projectTicketTypeDetail && projectTicketTypeDetail.show_component === 1 ?true:false,
      show_label: projectTicketTypeDetail && projectTicketTypeDetail.show_label===1?true:false,
      show_affected_version: projectTicketTypeDetail && projectTicketTypeDetail.show_affected_version==1?true:false,
      show_release_version: projectTicketTypeDetail && projectTicketTypeDetail.show_release_version===1?true:false,
      show_sprint: projectTicketTypeDetail && projectTicketTypeDetail.show_sprint===1?true:false,
      show_description: projectTicketTypeDetail && projectTicketTypeDetail.show_description==1?true:false,
      show_applicable_devices: projectTicketTypeDetail && projectTicketTypeDetail.show_applicable_devices===1 ?true:false,
      show_environment:projectTicketTypeDetail && projectTicketTypeDetail.show_environment===1?true:false,
      show_test_steps: projectTicketTypeDetail && projectTicketTypeDetail.show_test_steps===1?true:false,
      show_actual_results: projectTicketTypeDetail && projectTicketTypeDetail.show_actual_results===1?true:false,
      show_expected_results: projectTicketTypeDetail && projectTicketTypeDetail.show_expected_results===1?true:false,
      show_delivery_date: projectTicketTypeDetail && projectTicketTypeDetail.show_delivery_date===1?true:false,
      show_initial_eta: projectTicketTypeDetail && projectTicketTypeDetail.show_initial_eta===1?true:false,
      show_eta_date: projectTicketTypeDetail && projectTicketTypeDetail.show_eta_date===1?true:false,
      show_eta_time:projectTicketTypeDetail && projectTicketTypeDetail.show_eta_time===1?true:false,
      show_story_points: projectTicketTypeDetail && projectTicketTypeDetail.show_story_points===1?true:false,
      show_jira_ticket_id: projectTicketTypeDetail && projectTicketTypeDetail.show_jira_ticket_id===1?true:false,
      show_parent_ticket_id: projectTicketTypeDetail && projectTicketTypeDetail.show_parent_ticket_id===1?true:false,
      show_user_impact: projectTicketTypeDetail && projectTicketTypeDetail.show_user_impact===1?true:false,
      show_production_status: projectTicketTypeDetail && projectTicketTypeDetail.show_production_status===1?true:false,
      show_production_status_notes: projectTicketTypeDetail && projectTicketTypeDetail.show_production_status_notes===1?true:false,
      show_type:projectTicketTypeDetail && projectTicketTypeDetail.show_type===1?true:false,
      show_build: projectTicketTypeDetail && projectTicketTypeDetail.show_build===1?true:false,
      show_reference_screenshots: projectTicketTypeDetail && projectTicketTypeDetail.show_reference_screenshots===1?true:false,
      show_reporter:projectTicketTypeDetail && projectTicketTypeDetail.show_reporter===1?true:false,
      show_assignee: projectTicketTypeDetail.show_assignee===1?true:false,
      show_reviewer: projectTicketTypeDetail && projectTicketTypeDetail.show_reviewer===1?true:false,
      show_project: projectTicketTypeDetail && projectTicketTypeDetail.show_project===1?true:false,
      show_status: projectTicketTypeDetail && projectTicketTypeDetail.show_status===1?true:false,
      show_created_at: projectTicketTypeDetail && projectTicketTypeDetail.show_created_at===1?true:false,
      show_updated_at: projectTicketTypeDetail && projectTicketTypeDetail.show_updated_at===1?true:false,
      show_jira_created_at: projectTicketTypeDetail && projectTicketTypeDetail.show_jira_created_at===1?true:false,
      show_completed_at:projectTicketTypeDetail && projectTicketTypeDetail.show_completed_at===1?true:false,
      show_customer_delivery_date: projectTicketTypeDetail && projectTicketTypeDetail.show_customer_delivery_date===1?true:false,
      show_ticket_id: projectTicketTypeDetail && projectTicketTypeDetail.show_ticket_id===1?true:false,
      type: projectTicketTypeDetail && projectTicketTypeDetail.type,
      sort: projectTicketTypeDetail && projectTicketTypeDetail.sort,
      show_sub_tasks: projectTicketTypeDetail && projectTicketTypeDetail.show_sub_tasks===1?true:false,
      show_jira_assignee: projectTicketTypeDetail && projectTicketTypeDetail.show_jira_assignee===1?true:false,
      default_story_point:projectTicketTypeDetail?.default_story_point,
      ganaf:"",
      status: projectTicketTypeDetail.status.toString()?projectTicketTypeDetail.status.toString():"",
      sub_task_ticket_types: projectTicketTypeDetail?.sub_task_ticket_types,
      field: projectTicketTypeDetail && projectTicketTypeDetail?.fields ? projectTicketTypeDetail?.fields :"",
      fine_type: projectTicketTypeDetail && projectTicketTypeDetail?.fine_type ? projectTicketTypeDetail?.fine_type :""
        };

    res.json(OK, { data: data })
  } catch (err) {
    next(err);
    console.log(err);
  }
}



const search = async (req, res, next) => {
  try {

    let { page, pageSize, search, sort, sortDir, pagination ,projectId,status} = req.query;

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
      id:"id",
      name: "name",
      status: "status",
      sort: "sort",
      created_at: "created_at",
      updated_at: "updated_at",
      deleted_at:"deleted_at",

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

    const data = req.query;

    const where = {};

    where.company_id = companyId;
    // Search term
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
if(Number.isNotNull(projectId)){
  where.project_id = projectId
}  
if(Number.isNotNull(status)){
  where.status = status
}  
const query = {
      order: [[sortableFields[sortParam], sortDirParam]],
     
      where,
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    // Get sprint list and count
    const projectDetails = await ProjectTicketType.findAndCountAll(query);

    // Return sprint is null
    if (projectDetails.count === 0) {
      return res.json({});
    }

    const projectData = [];
    projectDetails.rows.forEach( (projectTicketTypeDetail) => {
      projectData.push({
        id:projectTicketTypeDetail?.id,
        name: projectTicketTypeDetail?.name,
        project_id:projectTicketTypeDetail?.project_id,
        role:projectTicketTypeDetail?.role,
        type_id:projectTicketTypeDetail?.type_id,
        update_ticket_id_with_jira_id:projectTicketTypeDetail?.update_ticket_id_with_jira_id,
        show_attachment_page_name:projectTicketTypeDetail?.show_attachment_page_name,
        show_attachment_platform:projectTicketTypeDetail?.show_attachment_platform,
        allow_to_create_parent_ticket:projectTicketTypeDetail?.allow_to_create_parent_ticket,
        show_reviewer:projectTicketTypeDetail?.allow_to_create_parent_ticket,
        status: projectTicketTypeDetail.status === Projects.STATUS_ACTIVE_VALUE ? Projects.STATUS_ACTIVE : Projects.STATUS_INACTIVE,
        test_case_creation_time: projectTicketTypeDetail?.test_case_creation_time,
        test_case_execution_time:projectTicketTypeDetail?.test_case_execution_time,
        show_test_cases: projectTicketTypeDetail?.show_test_cases,
        show_tasks: projectTicketTypeDetail?.show_tasks,
        show_estimated_hours: projectTicketTypeDetail?.show_estimated_hours,
        show_poa: projectTicketTypeDetail?.show_poa,
        show_acceptance_criteria: projectTicketTypeDetail?.show_acceptance_criteria,
        show_severity: projectTicketTypeDetail?.show_severity,
        show_priority: projectTicketTypeDetail?.show_priority,
        show_component: projectTicketTypeDetail?.show_component,
        show_label: projectTicketTypeDetail?.show_label,
        show_affected_version: projectTicketTypeDetail?.show_affected_version,
        show_release_version: projectTicketTypeDetail?.show_release_version,
        show_sprint: projectTicketTypeDetail?.show_sprint,
        show_description: projectTicketTypeDetail?.show_description,
        show_applicable_devices: projectTicketTypeDetail?.show_applicable_devices,
        show_environment:projectTicketTypeDetail?.show_environment,
        show_test_steps: projectTicketTypeDetail?.show_test_steps,
        show_actual_results: projectTicketTypeDetail?.show_actual_results,
        show_expected_results: projectTicketTypeDetail?.show_expected_results,
        show_delivery_date: projectTicketTypeDetail?.show_delivery_date,
        show_initial_eta: projectTicketTypeDetail?.show_initial_eta,
        show_eta_date: projectTicketTypeDetail?.show_eta_date,
        show_eta_time:projectTicketTypeDetail?.show_eta_time,
        show_story_points: projectTicketTypeDetail?.show_story_points,
        show_jira_ticket_id: projectTicketTypeDetail?.show_jira_ticket_id,
        show_parent_ticket_id: projectTicketTypeDetail?.show_parent_ticket_id,
        show_user_impact: projectTicketTypeDetail?.show_user_impact,
        show_production_status: projectTicketTypeDetail?.show_production_status,
        show_production_status_notes: projectTicketTypeDetail?.show_production_status_notes,
        show_type:projectTicketTypeDetail?.show_type,
        show_build: projectTicketTypeDetail?.show_build,
        show_reference_screenshots: projectTicketTypeDetail?.show_reference_screenshots,
        show_reporter:projectTicketTypeDetail?.show_reporter,
        show_assignee: projectTicketTypeDetail.show_assignee,
        show_reviewer: projectTicketTypeDetail?.show_reviewer,
        show_project: projectTicketTypeDetail?.show_project,
        show_status: projectTicketTypeDetail?.show_status,
        show_created_at: projectTicketTypeDetail?.show_created_at,
        show_updated_at: projectTicketTypeDetail?.show_updated_at,
        show_jira_created_at: projectTicketTypeDetail?.show_jira_created_at,
        show_completed_at:projectTicketTypeDetail?.show_completed_at,
        show_customer_delivery_date: projectTicketTypeDetail?.show_customer_delivery_date,
        show_ticket_id: projectTicketTypeDetail?.show_ticket_id,
        type: projectTicketTypeDetail?.type,
        sort: projectTicketTypeDetail?.sort,
        show_sub_tasks: projectTicketTypeDetail?.show_sub_tasks,
        show_jira_assignee: projectTicketTypeDetail?.show_jira_assignee,
         default_story_point:projectTicketTypeDetail?.default_story_point?projectTicketTypeDetail?.default_story_point:"",
         sub_task_ticket_types:projectTicketTypeDetail?.sub_task_ticket_types?projectTicketTypeDetail?.sub_task_ticket_types:"",
         fine_type: projectTicketTypeDetail?.fine_type ? projectTicketTypeDetail?.fine_type : "",
      });
    });
    res.json(OK, {
      totalCount: projectDetails.count,
      currentPage: page,
      pageSize,
      data: projectData,
      search,
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

const updateByStatus = async (req, res, next) => {
  let companyId = Request.GetCompanyId(req);

  let data = req.body;

  let { id } = req.params;
  const ProjectStatus = await Project.findOne({ where: { company_id: companyId, id: id } });

  const { status } = ProjectStatus;

  let company_id = Request.GetCompanyId(req);
  try {
    if (!id) {
      return res.json(400, {
        message: 'Invalid Id',
      });
    }

    let updateData = {};
    if (data.status) {
      updateData.status = data.status
    }

    await Project.update(updateData, {
      where: {
        id,
        company_id,
      },
    });

    // systemLog
    res.json(200, {
      message: 'Project Status Updated',
    });
    res.on('finish', async () => {
      //create system log for sale updation
      History.create(
        `Project Status Changed From ${
          status == ProjectStatus.ACTIVE_STATUS
            ? ProjectStatus.ACTIVE
            : status == ProjectStatus.IN_ACTIVE_STATUS
            ? ProjectStatus.IN_ACTIVE
            : ' '
        } to ${
          data.status == ProjectStatus.ACTIVE_STATUS
          ? ProjectStatus.ACTIVE
          : status == ProjectStatus.IN_ACTIVE_STATUS
          ? ProjectStatus.IN_ACTIVE
          : ' '
        } `,
        req,
        ObjectName.PROJECT,
        id
      );
    });
  } catch (err) {
    next(err);
    console.log(err);
    res.json(BAD_REQUEST, {
      message: err.message,
    });
  }
}

const getById = async (ticketId, companyId) => {
  try{
  let ticketTypeDetail = await ProjectTicketType.findOne({
    where: { company_id: companyId, id: ticketId }
  })

  return ticketTypeDetail;
}catch(err){
  console.log(err);
}
}

const list = async (req, res, next) => {
  try {
    try {
      let { projectId } = req.query;

      let companyId = Request.GetCompanyId(req);

      if (!companyId) {
        return res.send(404, { message: 'Company Not Found' });
      }

      let where = {};

      where.company_id = companyId;

      let statusValue = !isKeyAvailable(req.query, "status") ? Status.ACTIVE : isKeyAvailable(req.query, "status") && Number.isNotNull(req.query?.status) ? req.query?.status : null;

      let defaultValue = isKeyAvailable(req.query, "defaultValue") && Number.isNotNull(req.query?.defaultValue) ? req.query?.defaultValue : null

      where[Op.or] = [
        { status: { [Op.or]: [statusValue, null] } },
        { id: { [Op.or]: [defaultValue, null] } }
      ]

      if (Number.isNotNull(projectId)) {
        where.project_id = projectId
      }

      const query = {
        include: [{ model: Project, as: "projectDetail", required: false }],
        order: [['name', 'ASC']],
        where,
      };

      const ticketTypeDetail = await ProjectTicketType.findAll(query);

      let list = [];

      for (let i in ticketTypeDetail) {
        let { id, name, project_id, default_story_point, sort, projectDetail, fields } = ticketTypeDetail[i];

        const status = await StatusService.getFirstStatus(
          ObjectName.TICKET,
          companyId,
          id
        );

        let getStatusDetail = await StatusService.getData(status, companyId);

        let data = {
          id: id,
          name: name,
          sort: sort,
          project_id: project_id,
          default_story_point: default_story_point,
          projectName: projectDetail?.name,
          default_assignee: getStatusDetail?.default_owner,
          default_reviewer: getStatusDetail?.default_reviewer,
          fields: fields,
        };

        list.push(data);
      }
      res.json(OK, {
        data: list,
      });
    } catch (err) {
      console.log(err);
      res.json(BAD_REQUEST, { message: err.message });
    }
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
  updateByStatus,
  getById,
  list
};

