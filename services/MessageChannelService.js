const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Request = require("../lib/request");
const MessageChannelUserService = require("./MessageChannelUserService");
const { messageChannel, messageChannelUser } = require('../db').models;


class MessageChannelService {
  static create(req, res, next) {
    let data = req.body;
    let companyId = Request.GetCompanyId(req);
    const user = Request.getUserId(req)

    if (!data?.channel_name) {
      return res.json(BAD_REQUEST, { message: 'Name is Required' });
    }

    let createData = {
      name: data?.channel_name,
      company_id: companyId,
    };

    messageChannel.create(createData).then(async (response) => {
      await MessageChannelUserService.create(
        {
          body: {
            channel_user: user,
            channel_id: response?.id,
            company_id: companyId,
          },
        },
        null,
        null
      );
      res.json(Response.OK, { message: 'Channel Created' });
    });
  }

  static async search(req, res, next) {
    let { page, pageSize } = req.query;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 10;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }
    const companyId = Request.GetCompanyId(req);

    const where = {
      company_id: companyId,
      user_id: req && req.user && req.user.id
    };

    const query = {
      where: where,
      order: [['createdAt', 'DESC']],
      include: [
        {
          required: true,
          model: messageChannel,
          as: "messageChannelDetail",
        },
      ]
    };

    try {
      const messageChannelList = await messageChannelUser.findAndCountAll(query);
      if (messageChannelList.count === 0) {
        return res.json({ message: 'Channel Info not found' });
      }

      const data = [];

      for (let i = 0; i < messageChannelList.rows.length; i++) {
        const { messageChannelDetail } = messageChannelList.rows[i];
        data.push({
          channel_name: messageChannelDetail && messageChannelDetail?.name,
          channel_id: messageChannelDetail && messageChannelDetail?.id,
        });
      }

      res.json(Response.OK, {
        totalCount: messageChannelList.length,
        data: data,
        currentPage: page,
        pageSize,
      });
    } catch (err) {
      console.log(err);
      res.json(Response.OK, { message: err.message });
    }
  }
}

module.exports=MessageChannelService;