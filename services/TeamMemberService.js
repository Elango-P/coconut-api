const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const DataBaseService = require("../lib/dataBaseService");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { UserTeam, User } = require("../db").models;
const UserTeamModel = new DataBaseService(UserTeam);
const validator = require("../lib/validator");
const { Op, Sequelize, fn, col } = require("sequelize");
class TeamMemberService {
  static async create(req, res, next) {
    try {
      let data = req.body;
      let companyId = Request.GetCompanyId(req);

      if (!companyId) {
        return res.json(BAD_REQUEST, { message: "Company Id Not Found" });
      }

      let createData = {
        user_id: data?.user_id,
        team_user_id: data?.team_user_id,
        company_id: companyId,
      };
      let createResponse = await UserTeamModel.create(createData);

      res.json(Response.OK, { message: "Team Member Added" });
      res.on("finish", async () => {
        History.create("Team Member added", req, ObjectName.USER_TEAM_MEMBER, createResponse?.id);
      });
    } catch (err) {
      console.log(err);
      return res.json(BAD_REQUEST, { message: err.message });
    }
  }

  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination, user_id } = req.query;

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
      return res.json(400, "Company Not Found");
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      userFirstName: "userFirstName",
      teamUserFirstName: "teamUserFirstName",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };

    const sortParam = sort || "userFirstName";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort Team by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }


    const where = {};

    where.company_id = companyId;

    if(user_id){
        where.user_id = user_id
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where[Op.or] = [
            Sequelize.where(fn("concat", col("userDetail.name"), ' ', col("userDetail.last_name")), {
              [Op.iLike]: `%${searchTerm}%`,
            }),
            Sequelize.where(fn("concat", col("userTeamDetail.name"), ' ', col("userTeamDetail.last_name")), {
                [Op.iLike]: `%${searchTerm}%`,
              }),
          ];
    }

    let order =[]

    if(sortParam == "userFirstName"){
        order.push([{ model: User, as: 'userDetail' }, 'name', sortDirParam])  
    }else{
        order.push([{ model: User, as: 'userTeamDetail' }, 'name', sortDir])
    }

    const query = {
      order: order,
      include: [
        {
          required: false,
          model: User,
          as: "userDetail",
          attributes: ["name", "last_name", "media_url"],
        },
        {
          required: false,
          model: User,
          as: "userTeamDetail",
          attributes: ["name", "last_name", "media_url"],
        },
      ],
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
    try {
      let userTeamList = await UserTeamModel.findAndCount(query);
      let data = [];
      if (userTeamList && userTeamList.rows && userTeamList.rows.length > 0) {
        for (let i = 0; i < userTeamList.rows.length; i++) {
          const { id, user_id, team_user_id, userDetail, userTeamDetail } = userTeamList.rows[i];
          data.push({
            id,
            user_id,
            team_user_id,
            userFirstName: userDetail && userDetail?.name,
            userLastName: userDetail && userDetail?.last_name,
            userAvatarUrl: userDetail && userDetail?.media_url,
            teamUserFirstName: userTeamDetail && userTeamDetail?.name,
            teamUserlastName: userTeamDetail && userTeamDetail?.last_name,
            teamUserAvatarUrl: userTeamDetail && userTeamDetail?.media_url,
          });
        }
      }

      res.json(Response.OK, {
        totalCount: userTeamList.count,
        currentPage: page,
        pageSize,
        data,
        search,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async delete(req, res, next) {
    let id = req?.params?.id;

    let companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(400, { message: "Company Id is required" });
    }

    if (!id) {
      return res.json(400, { message: "User Team Member Id is required" });
    }

    let userTeamDetail = await UserTeamModel.find({
      where: {
        id: id,
        company_id: companyId,
      },
    });

    if (!userTeamDetail) {
      return res.json(400, { message: "User Team Member not found" });
    }

    await UserTeamModel.delete({
      where: {
        id: id,
        company_id: companyId,
      },
    });

    res.json(200, { message: "User Team Member Deleted" });
    res.on("finish", async () => {
      History.create("User Team Member Deleted", req, ObjectName.USER_TEAM_MEMBER, id);
    });
  }

  static async getListByUserId(userId, companyId){

    if(!userId){
      throw {message: "User Id is Required"}
    }

    if(!companyId){
      throw {message: "Company Id is Required"}
    }

    let userTeamList = await UserTeamModel.find({
      where:{
        user_id: userId,
        company_id: companyId
      },
      attributes:["team_user_id"]
    });

    return userTeamList && userTeamList;

  }
}

module.exports = TeamMemberService;
