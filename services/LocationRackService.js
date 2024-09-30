const { Op } = require("sequelize");
const ObjectName = require("../helpers/ObjectName");
const { OK, BAD_REQUEST } = require("../helpers/Response");
const Request = require("../lib/request");
const history = require("./HistoryService");
const  validator  = require("../lib/validator");
const Boolean = require("../lib/Boolean");
const Where = require("../lib/Where");
const ArrayList = require("../lib/ArrayList");
const LocationRack = require("../helpers/LocationRack");
const { LocationRack: LocationRackModel } = require("../db").models;



class LocationRackService {

    static async create(req, res, next) {
        let body = req.body;
        let companyId = Request.GetCompanyId(req);

        let createData = {
            name: body?.name,
            status: LocationRack.STATUS_INACTIVE,
            location_id: body?.location_id,
            company_id: companyId
        }

        await LocationRackModel.create(createData).then((response) => {
            res.json(OK, { message: "LocationRack Created" });
            res.on('finish', async () => {
                history.create(`LocationRack Created`, req, ObjectName.LOCATION_RACK, response?.id);
            });
        }).catch((error) => {
            history.create(`LocationRack Creation---->${error}`, req, ObjectName.LOCATION_RACK);
        })
    }

    static async search(req, res, next) {
        let { page, pageSize, search, sort, sortDir, pagination, location_id } = req.query;
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
          return res.json(BAD_REQUEST, 'Company Not Found');
        }
    
        // Sortable Fields
        const validOrder = ['ASC', 'DESC'];
        const sortableFields = {
          id: 'id',
          name : 'name',
          createdAt: 'createdAt',
        };
        const sortParam = sort || 'name';
        if (!Object.keys(sortableFields).includes(sortParam)) {
          return res.json(Response.BAD_REQUEST, { message: `Unable to sort by ${sortParam}` });
        }
        const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
        if (!validOrder.includes(sortDirParam)) {
          return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
        }
        const where = {};

        Where.id(where,"location_id",location_id)
    
        where.company_id = companyId
        const searchTerm = search ? search.trim() : ""
        if (searchTerm) {
          where[Op.or] = [
            {
              name: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
          ];
    
        }
    
    
        const query = {
          attributes: { exclude: ['deletedAt'] },
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
          // Get Vendor list and count
          const LocationRackList = await LocationRackModel.findAndCountAll(query);
          let rowList = LocationRackList && LocationRackList?.rows;
          if(ArrayList.isArray(rowList)){
            for (let i = 0; i < rowList.length; i++) {
                const { id, name, status } = rowList[i];

                data.push({
                    id,
                    name,
                    status: status == LocationRack.STATUS_INACTIVE ? LocationRack.STATUS_INACTIVE_TEXT: status == LocationRack.STATUS_ACTIVE ? LocationRack.STATUS_ACTIVE_TEXT:"",
                    statusId: status,
                    statusColor: status == LocationRack.STATUS_INACTIVE ? "red": status == LocationRack.STATUS_ACTIVE ? "green":""
                })
            }
          }
   
          res.json(OK,{
            totalCount: LocationRackList.count,
            currentPage: page,
            pageSize,
            data,
    
          });
        } catch (err) {
          console.log(err);
          res.json(OK, { message: err.message });
        }
      }

      static async delete(req,res,next){
        let locationRackId = req.query.id;
        let companyId = Request.GetCompanyId(req);


        if(!locationRackId){
            return res.json(400,{message: "Location Rack id Required"})
        }

        if(!companyId){
            return res.json(400,{message: "Company id Required"})
        }


        let isExist = await LocationRackModel.findOne({where:{id: locationRackId, company_id: companyId}})


        if(!isExist){
            return res.json(400,{message: "Detail Not Found"})
        }

        await isExist.destroy();
        res.json(OK, { message: "LocationRack Deleted" });
        res.on('finish', async () => {
            history.create(`LocationRack Deleted`, req, ObjectName.LOCATION_RACK, locationRackId);
        });
      }

      static async update(req,res,next){
        let locationRackId = req.query.id;
        let companyId = Request.GetCompanyId(req)
        let data = req.body

        let createData = {
            name: data?.name,
            status: data?.status,
        }
        await LocationRackModel.update(createData,{where: {id: locationRackId, company_id: companyId}}).then((response) => {
            res.json(OK, { message: "LocationRack Updated" });
            res.on('finish', async () => {
                history.create(`LocationRack Updated`, req, ObjectName.LOCATION_RACK, locationRackId);
            });
        }).catch((error) => {
            history.create(`LocationRack Updation---->${error}`, req, ObjectName.LOCATION_RACK, locationRackId);
        })
      }

  static async list(req, res, next) {
    let companyId = Request.GetCompanyId(req);

    if(!companyId){
      return res.json(400, {message: "company Id Required"})
    }

    let where = {}

    where.company_id = companyId
    where.status = LocationRack.STATUS_ACTIVE

    let data = []
    let rackList = await LocationRackModel.findAll({ where: where });
    if (ArrayList.isArray(rackList)) {
      for (let i = 0; i < rackList.length; i++) {
        const value = rackList[i];
        data.push({
          id: value?.id,
          value: value?.id,
          label: value?.name
        })
      }
    }
    res.json(OK, data)
  }
    
}

module.exports = LocationRackService;