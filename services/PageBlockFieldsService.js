const { Media } = require("../helpers/Media");
const ObjectName = require("../helpers/ObjectName");
const Boolean = require("../lib/Boolean");
const history = require("./HistoryService");
const validator = require('../lib/validator');
const MediaServices = require("./media");
const { OK } = require("../helpers/Response");
const { getMediaUrl } = require("../lib/utils");
const { Op } = require("sequelize");
const Response = require("../helpers/Response");
const MediaService = require("./MediaService");
const Request = require("../lib/request");
const Number = require("../lib/Number");
const { PageBlockFields, Media: MediaModal } = require("../db").models;


class PageBlockFieldsService {


    static async create(req, res, next) {
        try {

            let data = req.body;
            let mediaFile = req.files.media_file;
            const companyId = Request.GetCompanyId(req);
            let createData = {
                page_block_id: data?.page_block_id ? data?.page_block_id : "",
                description: data?.description ? data?.description : "",
                title: data?.title ? data?.title : null,
                company_id: companyId
            }
            await PageBlockFields.create(createData).then(async (response) => {
                if (response) {
                    if (mediaFile && mediaFile !== undefined) {

                        let imageData = {
                            file_name: mediaFile?.name.trim(),
                            name: mediaFile?.name.trim(),
                            company_id: companyId,
                            object_id: response?.id,
                            object_name: ObjectName.PAGE_BLOCK_FIELDS,
                            visibility: Media.VISIBILITY_PRIVATE
                        }
                        let mediaDetails = await MediaModal.create(imageData);
                        if (mediaDetails) {
                            await MediaServices.uploadMedia(
                                mediaFile?.path,
                                mediaDetails?.id,
                                mediaFile?.name,
                                mediaDetails.visibility == Media.VISIBILITY_PRIVATE ? true : false,
                                true,
                            )
                            await PageBlockFields.update({ media_id: mediaDetails?.id }, { where: { id: response?.id, company_id: companyId } }).then((updateRes)=>{
                                res.json(200, { message: "Page Block Field Added",data:response })
                            })
                        }
                    }else{
                        res.json(200, { message: "Page Block Field Added",data:response })

                    }
                }
                res.on('finish', async () => {
                    history.create(`Page Block Field Added`, req, ObjectName.PAGE_BLOCK_FIELDS, response?.id);
                });
            })
        } catch (err) {
            console.log(err);
        }
    }

    static async search(req, res, next) {
        let { page, pageSize, search, sort, sortDir, pagination, page_block_id } = req.query;
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

        const validOrder = ['ASC', 'DESC'];
        const sortableFields = {
            id: 'id',
            title: 'title',
            description: 'description',
        };
        const sortParam = sort || 'title';
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(Response.BAD_REQUEST, { message: `Unable to sort Visitors by ${sortParam}` });
        }
        const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
        if (!validOrder.includes(sortDirParam)) {
            return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
        }
        const where = {};
        where.company_id = companyId


        if(Number.isNotNull(page_block_id)){
            where.page_block_id=page_block_id
        }

        const searchTerm = search ? search.trim() : ""
        if (searchTerm) {
            where[Op.or] = [
                {
                    title: {
                        [Op.iLike]: `%${searchTerm}%`,
                    },

                },
                {
                    description: {
                        [Op.iLike]: `%${searchTerm}%`,
                    },

                },
            ];

        }


        const query = {
            include: [
                {
                    required: false,
                    model: MediaModal,
                    as: "mediaDetail",
                    where:{
                        object_name:ObjectName.PAGE_BLOCK_FIELDS
                    },
                    order:[["createdAt","DESC"]] 
                }
            ],
            order: [[sortableFields[sortParam], sortDirParam]],
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
            const details = await PageBlockFields.findAndCountAll(query);
            let pageBlockList = details && details?.rows;
            if (pageBlockList && pageBlockList.length > 0) {
                for (let i = 0; i < pageBlockList.length; i++) {
                    const { id, title, description,  media_id } = pageBlockList[i];
                    const getMediaId = await MediaModal.findOne({
                        where: { object_id: id, object_name: ObjectName.PAGE_BLOCK_FIELDS, company_id: companyId, },order:[["createdAt","DESC"]]
                      });
                    data.push({ id,media_id, title, description, media_url: await MediaService.getMediaURL(getMediaId?.id, companyId), })
                }
            }
            res.json(OK, {
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

    static async update(req, res) {
        const companyId = Request.GetCompanyId(req);
        try {
            const data = req.body;
            let id = req?.params?.id;
            let fileDetail = req && req.files && req.files.media_file;
            let isAlreadyExist = await PageBlockFields.findOne({
                where: {
                    id: id,
                    company_id: companyId
                }
            });

            if (!isAlreadyExist) {
                return res.json(400, { message: "Detail Not Found" })
            }

            let updateData = {
              title: data?.title ? data?.title :"",
              description: data?.description ? data?.description :""
            }

            if (fileDetail && fileDetail !== undefined) {
                let MediaDetail = await MediaModal.findOne({
                  where: { object_id: id, company_id: companyId, object_name: ObjectName.PAGE_BLOCK_FIELDS },
                });
                if (MediaDetail) {
                  await MediaDetail.destroy();
                }
              }

            await PageBlockFields.update(updateData, {
                where: {
                    id: id,
                    company_id: companyId
                }
            }).then((response) => {
                 res.json(200, { message: "Page Block Field updated" })
                res.on('finish', async () => {
                    history.create(`Page Block Field Updated`, req, ObjectName.PAGE_BLOCK_FIELDS, id);
                  });
            })
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };

    static async del (req, res, next) {
        const id = req.params.id;
        try {
      
          const company_id = Request.GetCompanyId(req);
          let pageBlockFieldDetail = await PageBlockFields.findOne({
            where: {
              id: id,
              company_id: company_id,
            },
          })

          if(!pageBlockFieldDetail){
            res.json(400,{message:"Detail Not Found"})
          }

          pageBlockFieldDetail.destroy()
          res.json(Response.OK, { message: "Page Block Field Deleted" });
          res.on('finish', async () => {
            history.create(`Page Block Field Deleted`, req, ObjectName.PAGE_BLOCK_FIELDS, pageBlockFieldDetail?.id);
          });
        } catch (err) {
          console.log(err);
          return res.json(Response.BAD_REQUEST, { message: err.message });
        }
      };

      static async list(page_block_id,companyId){
        try{
            const PageBlockFieldsList = await PageBlockFields.findAll({
                where: {
                    page_block_id: page_block_id,
                    company_id: companyId
                }
            });
            return PageBlockFieldsList;
        }catch(err){
            console.log(err);
        }
      }
}
module.exports = PageBlockFieldsService