const { Op } = require("sequelize");
const Status = require("../helpers/LocationAllocationUser");
const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const Number = require("../lib/Number");
const Request = require("../lib/request");
const history = require("./HistoryService");
const LocationAllocationService = require("./LocationAllocationService");
const Boolean = require("../lib/Boolean");
const { TYPE_ADDITIONAL_LEAVE, TYPE_LEAVE } = require("../helpers/Attendance");
const validator = require("../lib/validator")
const { LocationAllocationUser, LocationAllocation, Attendance, User } = require("../db").models;

class LocationAllocationUserService {
  static async create(req, res, next) {
    let data = req.body;
    let companyId = Request.GetCompanyId(req);

    let isLocationAllocationUserExist = await LocationAllocationUser.findOne({
      where: {
        location_allocation_id: data?.location_allocation_id,
        location_id: data?.location_id,
        shift_id: data?.shift_id,
        company_id: companyId,
      },
    });
    let createData = {
      location_allocation_id: data?.location_allocation_id,
      location_id: data?.location_id,
      shift_id: data?.shift_id,
      user_id: Number.isNotNull(data?.user_id) ? data?.user_id : null,
      company_id: companyId,
    };
    if (!isLocationAllocationUserExist) {
        createData.status = Status.STATUS_PENDING
      await LocationAllocationUser.create(createData).then((response) => {});
    } else {
            createData.status = !Number.isNotNull(data?.user_id) ? null : Number.isNotNull(data?.user_id) && !Number.isNotNull(isLocationAllocationUserExist?.status) ?  Status.STATUS_PENDING : isLocationAllocationUserExist?.status
      isLocationAllocationUserExist.update(createData);
    }

    res.json(200, {
      message: isLocationAllocationUserExist ? "Location Allocation User Updated" : "Location Allocation User Created",
    });
  }

  static async search(req, res, next) {
    let { location_allocation_id } = req.query;

    let companyId = Request.GetCompanyId(req);

    let where = {};

    where.company_id = companyId;

    if (Number.isNotNull(location_allocation_id)) {
      where.location_allocation_id = location_allocation_id;
    }

    let query = {
      where,
    };

    let response = await LocationAllocationUser.findAll(query);

    let data = [];
    if (response && response.length > 0) {
      for (let i = 0; i < response.length; i++) {
        const { location_allocation_id, location_id, shift_id, user_id, company_id, status } = response[i];

        data.push({
          location_allocation_id,
          location_id,
          shift_id,
          user_id,
          company_id,
          status
        });
      }
    }

    res.json(200, { data: data });
  }

  static async statusUpdate(req, res, next) {
    let data = req.body;
    let companyId = Request.GetCompanyId(req);

    let isLocationAllocationUserExist = await LocationAllocationUser.findOne({
      where: {
        location_allocation_id: data?.location_allocation_id,
        location_id: data?.location_id,
        shift_id: data?.shift_id,
        company_id: companyId,
      },
    });

    if(!isLocationAllocationUserExist){
        return res.json(400,{message:"Detail Not Found"})
    }
    let updateData = {
        status: isLocationAllocationUserExist?.status == Status.STATUS_PENDING ? Status.STATUS_CONFIRMED : Status.STATUS_PENDING
    };
  
      isLocationAllocationUserExist.update(updateData).then(()=>{
          res.json(200, {
            message: "Status Updated",
          });
      })

  }

  static resetToDefault = async (req, res, next) => {
    let companyId = Request.GetCompanyId(req)
    let id = req?.params?.id;

    let locationAllocationExist = await LocationAllocation.findOne({
      where: {
        id: id,
        company_id: companyId
      }
    });

    if (!locationAllocationExist) {
      return res.json(Response.BAD_REQUEST, { message: "Location Allocation Not Found" })
    }

    console.log(locationAllocationExist)
    await LocationAllocationUser.destroy({
      where: {
        location_allocation_id: id,
        company_id: companyId
      }
    }).then(async (response) => {

      await LocationAllocationService.createLocationAllocationUser(companyId, locationAllocationExist?.date, id);
      res.json(Response.OK, { message: "Location Allocation User Updated" });
      res.on("finish", async () => {
        history.create("Location Allocation User Updated", req, ObjectName.LOCATION_ALLOCATION, id);
      });

    })
  }

  static async leaveList(req, res, next) {
    try {
      let { page, pageSize, search, sort, sortDir, pagination, date } = req.query;

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
        return res.json(400, "Company Not Found")
      }

      // Sortable Fields
      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        userName: "userName",
      };

      const sortParam = sort || "userName";

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(Response.BAD_REQUEST, { message: `Unable to sort Location Allocation by ${sortParam}` });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid sort order" });
      }


      const where = {};

      where.company_id = companyId;

      where.type = {
        [Op.in]: [TYPE_ADDITIONAL_LEAVE, TYPE_LEAVE]
      }

      if (date) {
        where.date = date
      }
      // Search term
      const searchTerm = search ? search.trim() : null;
      if (searchTerm) {
        where[Op.or] = [
          {
            '$user.name$': {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ];
      }

      const query = {
        include: [
          {
            required: true,
            model: User,
            as: "user",
            attributes: ["name", "last_name", "media_url"],
          },
        ],
        order: [[{model: User, as: "user"},"name", sortDirParam]],
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

      let list = []
      let attendanceData = await Attendance.findAndCountAll(query);
      if (attendanceData && attendanceData.rows.length > 0) {
        for (let i = 0; i < attendanceData.rows.length; i++) {
          const { user } = attendanceData.rows[i];
          list.push({
            first_name: user?.name,
            last_name: user?.last_name,
            media_url: user?.media_url
          })
        }
      }

      res.json(Response.OK, {
        totalCount: attendanceData.count,
        currentPage: page,
        pageSize,
        data: list,
        search,
        sort,
        sortDir,
      });
    } catch (error) {
      console.log(error);
    }

  }
}
module.exports = LocationAllocationUserService;
