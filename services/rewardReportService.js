const { Op } = require("sequelize");
const Request = require("../lib/request");
const Response = require("../helpers/Response");
const DataBaseService = require("../lib/dataBaseService");
const OrderProductService = require("./OrderProductService");
const DateTime = require("../lib/dateTime");
const Boolean = require("../lib/Boolean");
const { User } = require("../db").models;
const userModelService = new DataBaseService(User);
const validator = require("../lib/validator");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");

class rewardReportService {
  static async report(req, res, next) {
    try {
      const params = req.query;
      let { page, pageSize, search, sort, sortDir, pagination, user, startDate, endDate } =
        params;

      // get company Id from request
      const companyId = Request.GetCompanyId(req);
     // Validate if page is not a number
     page = page ? parseInt(page, 10) : 1;
     if (isNaN(page)) {
       throw {
         message: "Invalid page",
       };
     }
      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        throw {
          message: "Invalid page size",
        };
      }
      const validOrder = ["ASC", "DESC"];
  
      const sortParam = sort ? sort : "name";
    
      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw {
          message: "Invalid sort order",
        };
      }
      let where = {};
      where.company_id = companyId;

      if (user) {
        where.id = user;
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

      let query = {
        where: where,
        attributes: ["id", "name", "last_name", "media_url"],
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

      const userList = await userModelService.findAndCount(query);
      const userData = userList.rows;
      const data = [];
      let timeZone = Request.getTimeZone(req);
    let date = DateTime.getCustomDateTime(req.query?.date, timeZone)



      for (const user of userData) {
        const { id, name, last_name, media_url } = user;
        let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
        let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)
        const param = {
          companyId: companyId,
          userId: id,
          startDate: (req?.query?.date && date) ? date?.startDate : startDate ? DateTime.toGMT(start_date,timeZone) : null,
          endDate: (req?.query?.date && date) ? date?.endDate:  endDate ? DateTime.toGMT(end_date,timeZone) : null,
        };
        const rewardCount = await OrderProductService.getRewardCount(param);
        data.push({
          firstName: name,
          lastName: last_name,
          image: media_url,
          rewardCount: rewardCount,
        });
      }

      data.sort((a, b) => b.rewardCount - a.rewardCount);
      if (sort == "name") {
        if (sortDir == "DESC") {
          data.sort((a, b) => {
            return b.lastName.localeCompare(a.lastName);
          });
        } else {
          data.sort((a, b) => {
            return a.firstName.localeCompare(b.firstName);
          });
        }
      }

      if (sort == "rewardCount") {
        if (sortDir == "DESC") {
          data.sort((a, b) => b.rewardCount - a.rewardCount);
        } else {
          data.sort((a, b) => a.rewardCount - b.rewardCount);
        }
      }
      return res.json(Response.OK, {
        totalCount: userList.count,
        currentPage: page,
        pageSize,
        data: data,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
      return res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }
}

module.exports = rewardReportService;
