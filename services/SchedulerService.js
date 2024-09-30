const { SchedulerJob } = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");
const schedulerJobService = new DataBaseService(SchedulerJob);
const Request = require("../lib/request");
const SchedulerJobStatus = require("../helpers/SchedulerJobStatus");
const schedularjob = require("../routes/schedulerJob/processList");
const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const { Op } = require("sequelize");
const History = require("../services/HistoryService");
const ObjectName = require("../helpers/ObjectName");
const Boolean = require("../lib/Boolean");
const validator = require(".././lib/validator");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const { getSettingValue } = require("../services/SettingService");
const Time = require("../lib/time");
const DateTime = require("../lib/dateTime");
const Number = require("../lib/Number")

const create = async (req, res) => {

  try {
    const data = req.body;
    const companyId = Request.GetCompanyId(req);

    let userDefaultTimeZone = await getSettingValue(USER_DEFAULT_TIME_ZONE, companyId);
    const isNameExist = await schedulerJobService.findOne({
      where: { name: data.job_name, company_id: companyId },
    });

    if (isNameExist) {
      return res.send(400, {
        message: 'scheduler Name already exists',
      });
    }

    let dayValue;
    try {
      dayValue = data?.day && JSON.parse(data?.day);
    } catch (error) {
      dayValue = data?.day;
    }

    const createData = {
      name: data?.name,
      job_name: data?.job_name,
      type: data?.type,
      interval: Number.Get(data?.interval),
      api_url: data?.api_url,
      status: data?.status,
      notes: data?.notes,
      to_email: data?.to_email.length > 0 ? data?.to_email.join(',') : null,
      to_slack: data?.to_slack ? data?.to_slack : null,
      company_id: companyId,
      day: dayValue && dayValue.join(','),
      date: data?.date ? data?.date : null,
      month: data?.month,
      type: data?.taskType,
      ...(validator.isKeyAvailable(data,"startTime") ? {start_time: data?.startTime ? DateTime.GetGmtDate(data?.startTime) : null }   :{} ),
      ...(validator.isKeyAvailable(data,"endTime") ? {end_time: data?.endTime ? DateTime.GetGmtDate(data?.endTime) : null }   :{} ),
      start_date :data?.start_date ? (data?.start_date) : null,
      end_date :data?.end_date ? (data?.end_date) : null,
    };
    if(validator.isKeyAvailable(data,"isOrderReportSchedulerJob") && data?.isOrderReportSchedulerJob){
    if(validator.isKeyAvailable(data,"object_status")){
      createData.object_status = data?.object_status ? data?.object_status : null
    }
    if(validator.isKeyAvailable(data,"object_name")){
      createData.object_name = data?.object_name ? data?.object_name : ""
    }

    if(validator.isKeyAvailable(data,"date_type")){
      createData.date_type = data?.date_type ? data?.date_type : null
    }
  }

     let schedulerDetail = await schedulerJobService.create(createData);

    res.json(Response.CREATE_SUCCESS, { message: "Job Scheduler added" });
    res.on('finish', async () => {
      History.create(
        "Job Scheduler added",
        req,
        ObjectName.SCHEDULER_JOB,schedulerDetail.id
      );
    });
  } catch (err) {
    console.log(err);
  }
};




//   const update = async (req, res, next) => {
//     const data = req.body;
//     const { id } = req.params;
//     const companyId = Request.GetCompanyId(req)
//     const name = data.name;
//     try {
//       const projectData = await Project.findOne({
//         where: { id, company_id: companyId },
//       });

//       if (!projectData) {
//         return res.json(400, { message: "Project Not Found" });
//       }
//       //update sprint details
//       const projectDetails = {
//         name: name,
//         status: data.status == Projects.ACTIVE ?Projects.ACTIVE_STATUS : Projects.IN_ACTIVE_STATUS,
//         sort: Number.Get(data.sort),
//         slug: data ? data.slug : "",
//         allow_manual_id: data.allow_manual_ticket == Projects.YES? Projects.YES_VALUE : Projects.NO_VALUE,
//         last_ticket_id:Number.Get(data.lastTicket),
//         status_text: data?.status
//       };
//       const save = await Project.update(projectDetails, {
//         where: { id: id, company_id: companyId },
//       });


//       // API response
//       res.json(UPDATE_SUCCESS, { message: "Project Updated" })

//       // History On Finish Function
//       res.on(("finish"), async () => {
//         History.create(`Project Updated`, req, ObjectName.PROJECT, id);
//       })

//     } catch (err) {
//       //create a log
//       res.json(BAD_REQUEST, { message: err.message, })
//     }
//   };



//   // Models

//   const del = async (req, res) => {

//     try {

//       // Get company Id from request
//       let projectId = req.params.id;

//       // Get company Id from request
//       const companyId = Request.GetCompanyId(req);

//       // Validate sprint Id exist or not
//       if (!projectId) {
//         return res.json(400, { message: "Project id is required" });
//       }

//       // Delete sprint
//       await Project.destroy({ where: { id: projectId, company_id: companyId } });

//       res.json(200, { message: "Project Deleted" });

//       // History On Finish Function
//       res.on(("finish"), async () => {
//         History.create(`Project Deleted`, req, ObjectName.PROJECT, pid);
//       })

//     } catch (err) {
//       return res.json(400, { message: err.message });
//     }
//   }

//   const Get = async(req, res, next) => {
//     const { id } = req.params;

//     try {
//       // Get the company Id
//       const company_id = Request.GetCompanyId(req);

//       if (!id) {
//         return res.json(400, { message: "Invalid Id" });
//       }

//       const projectData = await Project.findOne({
//         where: {
//           id: id,
//           company_id: company_id,
//         },
//       });

//       if (!projectData) return res.json(200, { message: "No Records Found" });


//     const { allow_manual_id }= projectData
//        projectData.allow_manual_id = (allow_manual_id == Projects.YES_VALUE)?Projects.YES : Projects.NO

//       let data = {
//         projectData
//       };

//       res.json(200, data);
//     } catch (err) {
//       next(err);
//       console.log(err);
//     }
//   }



const search = async (req, res, next) => {
  try {

    let { page, pageSize, search, sort, sortDir, pagination, api_url } = req.query;

    const data = req.query;
    const companyId = Request.GetCompanyId(req);



    let where = {};
    if (data.status == SchedulerJobStatus.ACTIVE) {
      data.status = SchedulerJobStatus.ACTIVE_STATUS;
    }
    if (data.status) {
      where.status = data.status;
    } 
     where.company_id= companyId
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: "Invalid page" };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: "Invalid page size" };
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      name: "name",
      job_name: "job_name",
      status: "status",
      started_at: "started_at",
      completed_at: "completed_at",
      end_time: "end_time",
      start_time: "start_time",
      id: "id",
      interval : "interval",
      start_date : "start_date",
      end_date : "end_date",
      type : "type",
      date : "date"
    };

    const sortParam = sort || "job_name";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(400, { message: `Unable to sort data by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(400, { message: "Invalid sort order" });
    }


    if (data.api_url) {
      where.api_url = data.api_url
    }

    // Search term
    const searchTerm = data.search ? data.search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          name: { [Op.iLike]: `%${searchTerm}%` },
        },
      ];
    }

    const query = {
      attributes: [
        "id",
        "name",
        "job_name",
        "interval",
        "api_url",
        "status",
        "notes",
        "started_at",
        "completed_at",
        "start_time",
        "to_email",
        "end_time",
        "day",
        "date",
        "month",
        "type",
        "to_slack",
        "start_date",
        "object_status",
        "object_name",
        "date_type",
        "end_date"
      ],
      order: [[sortParam, sortDirParam]],
      where,
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

    const SchedulerJobs = await schedulerJobService.findAndCount(query);

    let timeZone = Request.getTimeZone(req)

    const schedularJobList = [];
    SchedulerJobs.rows.forEach((schedularJob) => {

      schedularJobList.push(schedularjob(schedularJob, timeZone, true));
    });
    // eslint-disable-next-line no-unused-vars
    //   const { schedularJob } = getPageDetails();
    // const { count, currentPage, lastPage, pageStart, pageEnd } =
    //   getPageDetails(
    //     schedularJobs.count,
    //     page,
    //     pageSize,
    //     schedularJobList.length
    //   );
    res.json({
      schedularJob: schedularJobList,
      // count,
      // currentPage,
      // lastPage,
      // pageStart,
      // pageEnd,

      totalCount: SchedulerJobs.count,
      currentPage: page,
      pageSize,
      data: schedularJobList,
    });

  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

module.exports = {
  create,
  // update,
  // del ,
  // Get,
  search,
};

