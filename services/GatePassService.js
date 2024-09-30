const ObjectName = require('../helpers/ObjectName');
const { OK, BAD_REQUEST } = require('../helpers/Response');
const Request = require('../lib/request');
const History = require('./HistoryService');
const { gatePass, User, Media: MediaModal } = require('../db').models;
const validator = require('../lib/validator');
const Boolean = require('../lib/Boolean');
const { Sequelize, Op } = require('sequelize');
const Response = require('../helpers/Response');
const MediaService = require('./MediaService');
const { getMediaUrl } = require("../lib/utils");
const MediaServices = require("./media");
const { Media } = require("../helpers/Media");
const DateTime = require("../lib/dateTime");


class GatePassService {
  static async create(req, res, next) {
    try {
      let data = req.body;
      let fileDetail = req && req?.files && req?.files?.media_file;
      const companyId = Request.GetCompanyId(req);
      const userId = Request.getUserId(req);

      const createData = {
        owner_id: data?.owner_id ? data?.owner_id : userId,
        notes: data.notes,
        company_id: companyId,
      };

      let gatePassDetail = await gatePass.create(createData)


      let gatePassId = gatePassDetail && gatePassDetail?.id

      res.json(OK, { message: 'GatePass added', id: gatePassId });

      res.on('finish', async () => {

        History.create("GatePass added", req, ObjectName.GATE_PASS, gatePassId);

        let mediaUrl;

        if (fileDetail && fileDetail !== undefined) {

          let imageData = {
            file_name: fileDetail?.name.trim(),
            name: fileDetail?.name.trim(),
            company_id: companyId,
            object_id: gatePassDetail && gatePassDetail?.id,
            object_name: ObjectName.GATE_PASS,
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
          await gatePass.update({ media_id: mediaDetails?.id }, { where: { id: gatePassDetail && gatePassDetail?.id, company_id: companyId } }).then(async () => {

            mediaUrl = await MediaService.getMediaURL(mediaDetails?.id, companyId);

          })
        }


      });

    } catch (err) {
      next(err);
      console.log(err);
    }
  }


  // Update 
  static async update(req, res) {
    try {

      const companyId = Request.GetCompanyId(req);
      const userId = Request.getUserId(req);
      const { id } = req.params;
      const data = req.body;
      if (!id) {
        return res.json(BAD_REQUEST, { message: "GatePass id is required" });
      }

      const gatePassDetail = await gatePass.findOne({
        where: { id: id, company_id: companyId },
      });
      if (!gatePassDetail) {
        return res.json(BAD_REQUEST, { message: "Invalid GatePass id" });
      }
      const updateData = {
        id: id,
        notes: data?.notes,
        owner_id: data?.owner_id ? data?.owner_id : userId,
      };
      if (data.media_id) {
        updateData.media_id = data.media_id
      }

      const datas = await gatePass.update(updateData, { where: { id } });

      res.on("finish", async () => {
        History.create("GatePass Updated", req, ObjectName.GATE_PASS, id);
      });

      return res.json(Response.UPDATE_SUCCESS, {
        message: "GatePass Updated",
        data: data
      });

    } catch (err) {
      console.log(err);
    }


  }
  //search
  static async search(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination } = req.query;

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

    const companyId = req.user && req.user.company_id;

    if (!companyId) {
      return res.json(400, 'Company Not Found');
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      id: 'id',
      createdAt: 'createdAt',
      notes: 'notes',
      owner_id: 'owner_id'
    };
    const sortParam = sort || 'createdAt';
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(Response.BAD_REQUEST, { message: `Unable to sort GatePass by ${sortParam}` });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
    }
    const where = {};


    const searchTerm = search ? search.trim() : ""
    if (searchTerm) {
      where[Op.or] = [
        {
          notes: {
            [Op.iLike]: `%${searchTerm}%`,
          },

        },
      ];

    }

    let order = [];

    if (sortParam == "owner_id") {
      order.push([{ model: User, as: "owner" }, "name", sortDirParam]);
    }

    if (sort !== "owner_id" && sortParam) {
      order.push([sortableFields[sortParam], sortDirParam]);
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
          model: User,
          as: "owner",
        },
      ],
      order: order,
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
      const details = await gatePass.findAndCountAll(query);
      if (details.count === 0) {
        return res.json({ message: 'GatePass not found' });
      }

      details.rows.forEach(async (gatePass) => {

        const { id, name, owner_id, owner, notes, media_id, media, createdAt } = gatePass.get();
        data.push({
          id,
          owner_id: owner_id,
          name: name,
          first_name: owner && owner?.name,
          last_name: owner && owner?.last_name,
          notes: notes,
          media_id: media_id,
          media_url: media && media?.file_name && getMediaUrl(media?.file_name, media_id),
          owner_media_url: owner && owner.media_url,
          createdAt: DateTime.getDateTimeByUserProfileTimezone(createdAt, timeZone),
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
        return res.json(BAD_REQUEST, { message: 'gatePass Id is required' });
      }

      const gatePassDetail = await gatePass.findOne({
        where: { id: id, company_id: companyId },
      });



      if (!gatePassDetail) {
        return res.json(BAD_REQUEST, { message: 'gatePass Not found' });
      }


      const data = {
        id: gatePassDetail?.id,
        notes: gatePassDetail?.notes,
        media_id: gatePassDetail?.media_id,
        owner_id: gatePassDetail?.owner_id,
        media_url: gatePassDetail?.media_id && await MediaService.getMediaURL(gatePassDetail?.media_id, companyId),
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
      await gatePass.destroy({ where: { id: id, company_id: company_id } });

      res.json(200, { message: 'gatePass Deleted' });

      res.on('finish', async () => {
        await History.create("GatePass Deleted", req, ObjectName.GATE_PASS, id);
      });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }
}

module.exports = GatePassService;
