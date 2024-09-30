const { Sequelize, Op } = require('sequelize');

// Helpers
const ObjectName = require('../helpers/ObjectName');
const { OK, BAD_REQUEST } = require('../helpers/Response');
const Response = require('../helpers/Response');
const { Media } = require("../helpers/Media");
const setting = require("../helpers/Setting");
const Setting = require("../helpers/Setting");

// Lib
const Request = require('../lib/request');
const validator = require('../lib/validator');
const Boolean = require('../lib/Boolean');
const { getMediaUrl } = require("../lib/utils");
const config = require('../lib/config');
const DateTime = require('../lib/dateTime');
const String = require("../lib/string");

// Services
const History = require('./HistoryService');
const UserService = require('./UserService');
const TagService = require("./TagService");
const MediaService = require('./MediaService');
const SlackService = require('./SlackService');
const MediaServices = require("./media");
const { getSettingValue } = require('../services/SettingService');
const Number = require("../lib/Number");

// Models
const { Visitor,Candidate, Media: MediaModal, Tag } = require('../db').models;

class VisitorService {
  static async create(req, res, next) {
    try {
      let data = req.body;
      const companyId = Request.GetCompanyId(req);
      let userDefaultTimeZone = Request.getTimeZone(req)
      let fileDetail = req && req?.files && req?.files?.media_file;
      
      const createData = {
        name: data.name,
        phone: data.mobileNumber,
        purpose: data.purpose,
        notes: data.notes,
        title : data.title,
        company_id: companyId,
        type : data.type,
        person_to_meet : data.person_to_meet,
        position : data.position
      };
      const visitorData = {
        first_name: data.name,
        phone: data.mobileNumber,
        company_id: companyId,
        position : data.position
      };

      let visitorDetail = await Visitor.create(createData)

      let typeName = await Tag.findOne({where:{id:data.type, company_id:companyId }})


      let visitorId = visitorDetail && visitorDetail?.id

      res.json(OK, { message: 'Visitor added', id: visitorId });

      res.on('finish', async () => {
        
        History.create("Visitor added", req, ObjectName.VISITOR, visitorId);

        let mediaUrl;
        
        if (fileDetail && fileDetail !== undefined) {

          let imageData = {
            file_name: fileDetail?.name.trim(),
            name: fileDetail?.name.trim(),
            company_id: companyId,
            object_id: visitorDetail && visitorDetail?.id,
            object_name: ObjectName.VISITOR,
            visibility: Media.VISIBILITY_PUBLIC
          }
          let mediaDetails = await MediaModal.create(imageData);
          if (mediaDetails) {
            await MediaServices.uploadMedia(
              fileDetail?.path,
              mediaDetails?.id,
              fileDetail?.name,
              mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
              true,
            )
          }
          await Visitor.update({ media_id: mediaDetails?.id }, { where: { id: visitorDetail && visitorDetail?.id, company_id: companyId } }).then(async () => {

            mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);

          })
        }

        let channelId = await getSettingValue(setting.VISITOR_NOTIFICATION_CHANNEL, companyId);

        let text = `*New Visitor:* ${data?.name}(${typeName?.name})`;

        if (data.purpose) {
          text += ` came for ${data.purpose} at  ${DateTime.getDateTimeByUserProfileTimezone(visitorDetail?.created_at,userDefaultTimeZone)}\n`
        }

        if (data.mobileNumber) {
          text += `*Phone:* ${data.mobileNumber}\n`
        }

        if (data.notes) {
          text += `*Notes:* ${data.notes}\n`
        }
        let userList = await UserService.getSlack(data.person_to_meet, companyId);
        SlackService.sendSlackChannelMessageWithImage(companyId, channelId, mediaUrl, text)
        SlackService.sendSlackChannelMessageWithImage(companyId, userList?.slack_id, mediaUrl, text)

        let visitorType = await getSettingValue(setting.VISITOR_TYPE, companyId);         
             if(visitorType === data.type){
              let candidateDetail = await Candidate.create(visitorData)              
              let candidateId = candidateDetail && candidateDetail?.id
              let mediaUrl;
        
        if (fileDetail && fileDetail !== undefined) {

          let imageData = {
            file_name: fileDetail?.name.trim(),
            name: fileDetail?.name.trim(),
            company_id: companyId,
            object_id: candidateDetail && candidateDetail?.id,
            object_name: ObjectName.CANDIDATE,
            visibility: Media.VISIBILITY_PUBLIC
          }
          let mediaDetails = await MediaModal.create(imageData);
          if (mediaDetails) {
            await MediaServices.uploadMedia(
              fileDetail?.path,
              mediaDetails?.id,
              fileDetail?.name,
              mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
              true,
            )
          }
          await Candidate.update({ media_id: mediaDetails?.id }, { where: { id: candidateDetail && candidateDetail?.id, company_id: companyId } }).then(async () => {

            mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);

          })
        }
             }
             
      });

    } catch (err) {
      next(err);
      console.log(err);
    }
  }

  static async createAuditLog(olddata, updatedData, req, id) {
    let companyId = Request.GetCompanyId(req);
    let auditLogMessage = new Array();

    let oldTypeValue, newTypeValue;

    if (olddata?.type !== undefined) {
      oldTypeValue = await TagService.getName(olddata?.type, companyId);
    }

    if (updatedData?.type !== undefined) {
        newTypeValue = await TagService.getName(updatedData?.type, companyId);
    }

    if (updatedData?.name && olddata?.name !== updatedData.name) {
      if (olddata?.name !== updatedData.name) {
        auditLogMessage.push(`Name Changed to ${updatedData?.name}\n`);
      }
    }

    if (updatedData?.type !== undefined && olddata?.type !== updatedData?.type) {
      if (oldTypeValue !== newTypeValue) {
          auditLogMessage.push(`Type Changed to ${newTypeValue}\n`);
      }
    }

    if (updatedData?.phone && olddata?.phone !== updatedData?.phone) {
      if (olddata?.phone !== updatedData?.phone) {
        auditLogMessage.push(`Phone Number Changed to ${updatedData?.phone}\n`);
      }
    }

    if (updatedData?.purpose && updatedData?.purpose !== olddata.purpose) {
      if (olddata?.purpose !== updatedData?.purpose) {
        auditLogMessage.push(`Purpose Changed to ${updatedData?.purpose}\n`);
      }
    }

    if (updatedData?.notes && updatedData?.notes !== olddata.notes) {
      if (olddata?.notes !== updatedData?.notes) {
        auditLogMessage.push(`Notes Changed to ${updatedData?.notes}\n`);
      }
    }

    if (updatedData?.person_to_meet && Number.Get(olddata.person_to_meet) !== Number.Get(updatedData?.person_to_meet)) {
        let person_to_meet = await UserService.getUserDetailById(updatedData?.person_to_meet, companyId);
        auditLogMessage.push(
          `Person Changed  ${String.concatName(person_to_meet?.name, person_to_meet?.last_name)}\n`
        );
    }

    if (auditLogMessage && auditLogMessage.length > 0) {
      let message = auditLogMessage.join();
      History.create(message, req, ObjectName.VISITOR, id);
    } else {
      History.create("Visitor Updated", req, ObjectName.VISITOR, id);
    }
  }

  // Update
  static async update(req, res) {
    try {

      const companyId = Request.GetCompanyId(req);
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        return res.json(BAD_REQUEST, { message: "Visitor id is required" });
      }

      const visitorDetail = await Visitor.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!visitorDetail) {
        return res.json(BAD_REQUEST, { message: "Invalid visitor id" });
      }
      const updateData = {
        id: id,
        name: data?.name,
        phone: data?.phone,
        purpose: data?.purpose,
        title: data?.title,
        notes: data?.notes,
        type : data?.type,
        position : data?.position,
        person_to_meet : data.person_to_meet,

      };
      if (data.media_id) {
        updateData.media_id = data.media_id
      }

      const datas = await Visitor.update(updateData, { where: { id } });

      res.on("finish", async () => {
        this.createAuditLog (visitorDetail, updateData,req,id);
      });

      return res.json(Response.UPDATE_SUCCESS, {
        message: "Visitor Updated",
        data: data
      });

    } catch (err) {
      console.log(err);
    }


  }
  //search
  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination, visitorType } = req.query;

    let timeZone = Request.getTimeZone(req)

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page' });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }

    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(400, 'Company Not Found');
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      name: 'name',
      purpose: 'purpose',
      created_at: 'created_at',
      typeName: 'typeName'
    };
    const sortParam = sort || 'created_at';
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(Response.BAD_REQUEST, { message: `Unable to sort Visitors by ${sortParam}` });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
    }
    const where = {};
    where.company_id = companyId;

    if (visitorType) {
      where.type = visitorType;
    }

    const searchTerm = search ? search.trim() : "";
    if (searchTerm) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
          
        },
        {
          purpose: {
            [Op.iLike]: `%${searchTerm}%`,
          },

        },
      ];

    }


    const query = {
      attributes: { exclude: ['deletedAt'] },

      include: [
        {
          required: false,
          model: MediaModal,
          as: "media",
        },
        {
          required: false,
          model: Tag,
          as: "tagDetails",
        },
      ],
      order: [
        sortParam === "typeName"
          ? [{ model: Tag, as: "tagDetails" }, "name", sortDirParam]
          : [[sortableFields[sortParam], sortDirParam]],
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

    const data = [];
    try {
      // Get Vendor list and count
      const details = await Visitor.findAndCountAll(query);
      if (details.count === 0) {
        return res.json({ message: 'Visitors not found' });
      }

      details.rows.forEach(async (visitor) => {

        const { id, name, phone,title,position, purpose,person_to_meet, notes, media_id, media ,created_at ,type,tagDetails} = visitor.get();
        data.push({
          id,
          name: name,
          phone: phone,
          purpose: purpose,
          notes: notes,
          type:type,
          title :title,
          person_to_meet : person_to_meet,
          position : position,
          media_id: media_id,
          media_url: media?.file_name && getMediaUrl(media?.file_name, media_id),
          created_at: DateTime.getDateTimeByUserProfileTimezone(created_at,timeZone),
          typeName:tagDetails?.name?tagDetails?.name:""
        });
      });
      res.send({
        totalCount: details.count,
        currentPage: page,
        pageSize,
        data,

      });
    } catch (err) {
      console.log(err);
      res.json(OK, { message: err.message });
    }
  }

  //get

  static async get(req, res, next) {
    try {
      const { id } = req.params;
      const companyId = Request.GetCompanyId(req);
      if (!id) {
        return res.json(BAD_REQUEST, { message: 'visitor Id is required' });
      }

      const visitordetail = await Visitor.findOne({
        where: { id: id, company_id: companyId },
      });

      if (!visitordetail) {
        return res.json(BAD_REQUEST, { message: 'visitor Not found' });
      }

      const tagDetails = await Tag.findOne({
        where : {id : visitordetail?.type, company_id: companyId }
      })



      const data = {
        id: visitordetail?.id,
        name: visitordetail?.name,
        notes: visitordetail?.notes,
        purpose: visitordetail?.purpose,
        position : visitordetail?.position,
        title : visitordetail?.title,
        person_to_meet : visitordetail?.person_to_meet,
        phone: visitordetail?.phone,
        type:visitordetail?.type,
        typeName :tagDetails?.name,
        media_id: visitordetail?.media_id,
        media_url: visitordetail?.media_id && await MediaService.getMediaURL(visitordetail?.media_id, companyId),
      };
      res.json(OK, { data: data });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async del(req, res) {
    try {
      const id = req.params.id;
      const company_id = Request.GetCompanyId(req);
      await Visitor.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'visitor Deleted' });

      res.on('finish', async () => {
        await History.create("Visitor Deleted", req, ObjectName.VISITOR, id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }
}

module.exports = VisitorService;
