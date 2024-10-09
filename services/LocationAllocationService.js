const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const Request = require("../lib/request");
const History = require("./HistoryService");
const Boolean = require("../lib/Boolean");
const { LocationAllocation,status:statusModal, LocationAllocationUser } = require("../db").models;
const validator = require("../lib/validator");
const StatusService = require("./StatusService");
const Number = require("../lib/Number");
const UserService = require("./UserService");
const { getAttendanceCount } = require("./AttendanceService");
const PreferredLocationService = require("./PreferredLocationService");
const Status = require("../helpers/LocationAllocationUser");
const LocationService = require("./LocationService");
const DateTime = require("../lib/dateTime");
const { Op } = require("sequelize");



class LocationAllocationService {
  static async create(req, res, next) {
    try {
    let data = req.body;
    let companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(200, { message: "Company id Not found" });
    }

   let isDataAlreadyExist =  await LocationAllocation.findOne({where:{
      date: data?.date,
      company_id:companyId
    }})

    if(isDataAlreadyExist){
      return res.json(400,{message:"Location Allocation AlreadyExist"})
    }

    let status = await StatusService.getFirstStatus(ObjectName.LOCATION_ALLOCATION,companyId)

    let createData = {
      date: data?.date,
      status: status ? status:null,
      company_id: companyId,
    };

    await LocationAllocation.create(createData).then((response) => {
      res.json(200, { message: "Location Allocation Created" });
      res.on("finish", async () => {
      await this.createLocationAllocationUser(companyId,data?.date,response?.id)
        History.create("Location Allocation Created", req, ObjectName.LOCATION_ALLOCATION, response.id);
      });
    });
  } catch (error) {
      console.log(err);
      res.json(400,{message:error.message})
  }
  }

  static async search(req, res, next) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination, endDate,startDate  } = req.query;
      let timeZone = Request.getTimeZone(req)

      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page" });
      }
      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page size" });
      }

      const companyId = Request.GetCompanyId(req);

      // Sortable Fields
      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        id: "id",
        createdAt: "createdAt",
        date:"date",
      };
      const sortParam = sort || "createdAt";

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(Response.BAD_REQUEST, { message: `Unable to sort product by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid sort order" });
      }

      let where = {};
      where.company_id = companyId;


      let date = DateTime.getCustomDateTime(req?.query?.date,timeZone)

      if (date && Number.isNotNull(req?.query?.date)) {
      where.date = {
        [Op.and]: {
          [Op.gte]: date?.startDate,
          [Op.lte]: date?.endDate,
        },
      };
      }

      if (startDate && !endDate) {
        where.date = {
          [Op.and]: {
            [Op.gte]: DateTime.getSQlFormattedDate(startDate),
          },
        };
      }
  
      if (endDate && !startDate) {
        where.date = {
          [Op.and]: {
            [Op.lte]: DateTime.getSQlFormattedDate(endDate),
          },
        };
      }
  
      if (startDate && endDate) {
        where.date = {
          [Op.and]: {
            [Op.gte]: DateTime.getSQlFormattedDate(startDate),
            [Op.lte]: DateTime.getSQlFormattedDate(endDate),
          },
        };
      }


      const query = {
        include: [
          {
            required: false,
            model: statusModal,
            as: "statusDetail",
          }
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

      let data = [];
      const userAllocationList = await LocationAllocation.findAndCountAll(query);
      let userAllocation = userAllocationList && userAllocationList?.rows;

      for (let i = 0; i < userAllocation.length; i++) {
        const { id, date, statusDetail,status } = userAllocation[i];
        data.push({
          id,
       statusName:statusDetail?.name,
       statusId: status,
          date: date,
          statusColor: statusDetail?.color_code,
        });
      }

      res.json(Response.OK, {
        totalCount: userAllocationList.count,
        currentPage: page,
        pageSize,
        data,
        search,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }

  static del(req, res, next) {
    const id = req.params.id;
    const companyId = Request.GetCompanyId(req);
    LocationAllocation.findOne({ where: { id: id, company_id: companyId } })
      .then((response) => {
        if (!response) {
          return res.json(400, "Location Allocation not found");
        }
        LocationAllocation.destroy({
          where: { id: id, company_id: companyId },
        }).then(() => {
          res.json({ message: "Location Allocation Deleted" });
          res.on("finish", async () => {
            History.create(" Location Allocation Deleted", req, ObjectName.LOCATION_ALLOCATION, id);
          });
        });
      })
      .catch((err) => {
        req.log.error(err);
        next(err);
      });
  }


  static updateStatus = async (req, res, next) => {
    const data = req.body;
    const { id } = req.params;

    if (!id) {
      return res.json(Response.BAD_REQUEST, { message: "Location Allocation id is required" });
    }

    const updateData = {
      status: data.status,
    };

    try {
      const save = await LocationAllocation.update(updateData, { where: { id: id } });

      res.json(Response.UPDATE_SUCCESS, {
        message: "Location Allocation updated",
      });

      res.on("finish", async () => {
        History.create("Location Allocation updated", req, ObjectName.CANDIDATE, save.id);
      });

      // API response
    } catch (err) {
      console.log(err);
      res.json(Response.BAD_REQUEST, {
        message: err.message,
      });
    }
  };



  static async get(req, res, next) {
    try {
      let location_allocation_id = req?.params?.id;
      let companyId = Request.GetCompanyId(req)
      let where = {};
      where.company_id = companyId;

      if (Number.isNotNull(location_allocation_id)) {
        where.id = location_allocation_id
      }

      const query = {
        include: [
          {
            required: false,
            model: statusModal,
            as: "statusDetail",
          }
        ],
        order: [["createdAt", "DESC"]],
        where,
      };

      const userAllocationDetail = await LocationAllocation.findOne(query);

      const { id, date, statusDetail, status } = userAllocationDetail;
      let data = {
        id,
        statusName: statusDetail?.name,
        statusId: status,
        date: date,
        statusColor: statusDetail?.color_code,
      }

      res.json(Response.OK, { data });
    } catch (err) {
      console.log(err);
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }


  static async createLocationAllocationUser(companyId, date, locationAllocationId) {

    let userList = await UserService.list(companyId);

    if (userList && userList.length > 0) {
      for (let i = 0; i < userList.length; i++) {
        const { id } = userList[i];

        let { Leave } = await getAttendanceCount({
          company_id: companyId,
          user_id: id,
          date: date
        })

        if (Leave == 0) {

          let getFirstPreferredLocation = await PreferredLocationService.getFirstRecord(companyId, id)

          if (getFirstPreferredLocation) {

            let isAllowedShift =  await LocationService.getLocationDetails(getFirstPreferredLocation?.location_id,companyId);
            if(isAllowedShift && isAllowedShift?.allowed_shift?.split(",") && isAllowedShift?.allowed_shift?.split(",").length > 0 && isAllowedShift?.allowed_shift?.split(",")?.includes(getFirstPreferredLocation?.shift_id?.toString())){
              let isLocationAllocationUserExist = await LocationAllocationUser.findOne({
                where: {
                  location_allocation_id: locationAllocationId,
                  location_id: getFirstPreferredLocation?.location_id,
                  shift_id: getFirstPreferredLocation?.shift_id,
                  company_id: companyId,
                },
              });
              if (!isLocationAllocationUserExist) {
                let createData = {
                  location_allocation_id: locationAllocationId,
                  location_id: getFirstPreferredLocation?.location_id,
                  shift_id: getFirstPreferredLocation?.shift_id,
                  user_id: getFirstPreferredLocation?.user_id,
                  status: Status.STATUS_CONFIRMED,
                  company_id: companyId,
                }
                await LocationAllocationUser.create(createData)
              }
            }
          }
        }


      }
    }
  }


}
module.exports = LocationAllocationService;
