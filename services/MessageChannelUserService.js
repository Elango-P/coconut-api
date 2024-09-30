const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Request = require("../lib/request");
const { messageChannelUser } = require("../db").models;


class MessageChannelUserService {
  static async create(req, res, next) {
    try{
    let data = req.body;
    let companyId=null
    if(req && req.user){
     companyId = Request.GetCompanyId(req);
    }
    if (!data?.channel_user) {
      return res.json(BAD_REQUEST, { message: "User id Required" });
    }

    if (!data?.channel_id) {
      return res.json(BAD_REQUEST, { message: "Channel id Required" });
    }

    let createData = {
      user_id: parseInt(data?.channel_user),
      channel_id: parseInt(data?.channel_id),
      company_id: data?.company_id ? data?.company_id: companyId,
    };

    await messageChannelUser.create(createData).then((response) => {
      res.json(Response.OK, { message: "Channel User Added" });
    });
}catch(err){
    console.log(err);
}
  }
}
module.exports=MessageChannelUserService;