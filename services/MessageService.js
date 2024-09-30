const { dataType } = require('db-migrate');
const ObjectName = require('../helpers/ObjectName');
const DateTime = require('../lib/dateTime');
const { shortDateAndTime } = require('../lib/dateTime');
const Request = require('../lib/request');
const History = require('./HistoryService');
const Permission = require('../helpers/Permission');
const { BAD_REQUEST, UPDATE_SUCCESS, OK, DELETE_SUCCESS } = require('../helpers/Response');
const message = require('../routes/message');
const Response = require('../helpers/Response');

const { Message } = require('../db').models;
// Model
const { Ticket, User, Project } = require('../db').models;
const { Op, Sequelize } = require('sequelize');

const create = async (req, res) => {
  try {

  const data = req.body;
  const companyId = Request.GetCompanyId(req);
  const userId = Request.getUserId(req);
  const createData = {
    user_id: userId,
    reciever_user_id: data.reciever_user_id,
    message: data.message,
    company_id: companyId,
    object_name: ObjectName.MESSAGE,
  };
  await Message.create(createData);

  res.json(200, { message: 'Message Sent SuccessFully', data: data.message });
      
} catch (err) {
    console.log(err);
}
};

/**
 * Module dependencies
 */

async function update(req, res, next) {
  const company_id = Request.GetCompanyId(req);
  const data = req.body;
  const { id, messageId } = req.params;
  let userId = req.user.id;
  try {

    if (id && messageId === "null") {
      const updateMessage = {
        read_at: new Date(),
      };

      const save = await Message.update(updateMessage, {
        where: { id: id, company_id: company_id },
      });
      if (save) {
        return res.json(OK, { message: 'message updated' });

      }
    }
    let splitMessageIds = messageId.split(',');
    let messageIds = [];
    for (let i = 0; i < splitMessageIds.length; i++) {
      const values = splitMessageIds[i];
      messageIds.push(Number(values));
    }

    // Validate tag id
    if (!id) {
      return res.json(BAD_REQUEST, { message: 'message id is required' });
    }

    for (let i in messageIds) {
      let where = {};

      if (messageIds) {
        where.id = messageIds[i];
      }

      const updateMessage = {
        read_at: new Date(),
      };

      if (data.message) {
        updateMessage.message = data.message;
      }
      const save = await Message.update(updateMessage, {
        where: { id: messageIds[i], company_id: company_id, user_id: id },
      });

    }
    res.json(UPDATE_SUCCESS, {
      message: 'Message Updated',
    });
    res.on('finish', async () => {
      // create system log for message updation
      History.create("Message Updated", req, ObjectName.TICKET, id);
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

async function search(req, res, next) {
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
  const userId = Request.getUserId(req);

  let receiverWhere = {};
  const where = {
    company_id: companyId,
    [Op.or]: [{ '$sender.id$': userId }, { '$reciever.id$': userId }],
  };

  if (req && req.query && req.query.id) {
    receiverWhere.id = req.query.id;
  }
  const query = {
    attributes: { exclude: ['deletedAt'] },
    include: [
      {
        required: true,
        model: User,
        as: 'sender',
      },
      {
        required: true,
        model: User,
        as: 'reciever',
        where: receiverWhere,
      },
    ],
    where: where,
    order: [['createdAt', 'DESC']],
  };

  try {
    const details = await Message.findAndCountAll(query);

    if (details.count === 0) {
      return res.json({ message: 'Message Info not found' });
    }

    const data = [];
    let totalMessageCount = 0
    let messageDetails = details && details.rows;
    const receiverIds = messageDetails.map((item) => item.reciever.id);
    const uniqueReceiverIds = Array.from(new Set(receiverIds));


    if (uniqueReceiverIds && uniqueReceiverIds.length > 0) {
      for (let i = 0; i < uniqueReceiverIds.length; i++) {
        const { reciever, sender, message, createdAt } = messageDetails.find(
          (item) => item.reciever.id === uniqueReceiverIds[i]
        );
        if (reciever.id !== userId) {

          const receiverCount = await Message.findAll({
            where: { company_id: companyId, user_id: reciever.id, reciever_user_id: sender.id, read_at: null },
          });
          let recieverMessageId = [];
          for (let i in receiverCount) {
            let { id } = receiverCount[i];
            recieverMessageId.push(Number(id));
          }
          totalMessageCount += receiverCount && receiverCount.length
          data.push({
            first_name: reciever.name,
            last_name: reciever.last_name,
            id: reciever.id,
            media: reciever.media_url,
            recent_last_message: message,
            recent_message_timestamp: createdAt,
            read_at: receiverCount.length,
            recieverMessageId: recieverMessageId,
          });
        }
      }
    }

    res.json(Response.OK, {
      totalCount: uniqueReceiverIds.length,
      totalMessageCount,
      data: data,
      currentPage: page,
      pageSize,
    });
  } catch (err) {
    console.log(err);
    res.json(Response.OK, { message: err.message });
  }
}

async function del(req, res, next) {
  try {
    const { id, messageId } = req.params;

    const company_id = Request.GetCompanyId(req);
    // Validate tag id
    if (!id) {
      return res.json(BAD_REQUEST, { message: 'Object id is required' });
    }

    if (!messageId) {
      return res.json(BAD_REQUEST, { message: 'Message id is required' });
    }
    const userId = req.user.id;
    // Validate tag is exist or not
    const messageDetails = await Message.findOne({
      where: { id: messageId, object_id: id, company_id: company_id, user_id: userId },
    });

    if (!messageDetails) {
      return res.json(BAD_REQUEST, { message: ' Message not found' });
    }

    // Delete tag
    await messageDetails.destroy();
    res.on('finish', async () => {
      History.create("Message Deleted", req, ObjectName.TICKET_TASK, id);
    });

    res.json(200, { message: 'Message Deleted' });
  } catch (err) {
    console.log(err);
  }
}

async function get(req, res, next) {
  try {
    const company_id = Request.GetCompanyId(req);
    const sender_user_id = Request.getUserId(req);
    const reciever_user_id = req.params.reciever_user_id;

    const senderMessageDetails = await Message.findAll({
      // Include the 'createdAt' field in the result
      where: {
        [Op.or]: [{ user_id: sender_user_id, reciever_user_id: reciever_user_id }],
        company_id: company_id,
      },
    });

    const recieverMessageDetails = await Message.findAll({
      // Include the 'createdAt' field in the result
      where: {
        [Op.or]: [{ user_id: reciever_user_id, reciever_user_id: sender_user_id }],
        company_id: company_id,
      },
    });

    const senderMessages = senderMessageDetails
      .filter((message) => message.user_id === sender_user_id)
      .map((message) => ({
        message: message.message,
        timestamp: message.createdAt, // Add the 'createdAt' value as 'timestamp'
      }));

    const receiverMessages = recieverMessageDetails
      .filter((message) => parseInt(message.user_id) == reciever_user_id)
      .map((message) => ({
        message: message.message,
        timestamp: message.createdAt, // Add the 'createdAt' value as 'timestamp'
      }));

    let data = {
      senderMessages: senderMessages,
      receiverMessages: receiverMessages,
    };
    res.json(data);
  } catch (err) {
    next(err);
    console.log(err);
  }
}

async function unRead(req, res, next) {

  const companyId = Request.GetCompanyId(req);

  const userId = Request.getUserId(req);

  const where = {
    company_id: companyId,
    '$reciever.id$': userId,
    read_at: null,
  };
  
  const query = {
    include: [
      {
        required: true,
        model: User,
        as: 'sender',
      },
      {
        required: true,
        model: User,
        as: 'reciever',
      },
    ],
    where: where,
    order: [['createdAt', 'DESC']],
  };

  try {
    const messages = await Message.findAll(query);

    if (messages.length === 0) {
      return res.json({ message:"Message Info not found" });
    }

    const data = messages.map((message) => ({
      first_name: message.sender.name,
      last_name: message.sender.last_name,
      id: message.id,
      media: message.sender.media_url,
      recent_last_message: message.message,
      recent_message_timestamp: message.createdAt,
      read_at: null,
      recieverMessageId: [message.id],
    }));

    res.json({
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
}

module.exports = {
  create,
  update,
  search,
  del,
  get,
  unRead
};
