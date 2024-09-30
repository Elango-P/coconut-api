const { Op } = require("sequelize");
const App = require("../helpers/App");
const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const ArrayList = require("../lib/ArrayList");
const Request = require("../lib/request");
const History = require("./HistoryService");
const {appVersion } = require("../db").models;
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");





class AppVersionService {

    static async create(req, res, next) {
        const data = req.body;
    
        const companyId = Request.GetCompanyId(req);
    
        // Validate name
        if (!data?.name) {
            return res.json(BAD_REQUEST, { message: "Name is required", })
        }
    
        // Tag data
        const createData = {
            name: data.name,
            status: data.status ? data.status :  App.STATUS_ACTIVE ,
            app_id : data.app_id,
            company_id: companyId,
        };
    
        try {
            const name = data.name.trim();
    
            // Validate duplicate Tag name
            const versionExist = await appVersion.findOne({
                where: {app_id : data.app_id, name , company_id: companyId },
            });
            if (versionExist) {
                return res.json(Response.BAD_REQUEST, { message:  "Version Name Already Exist " })
            }
            // Create tag
            const versionDetail=await appVersion.create(createData);
    
            //create a log
            res.on('finish', async () => {
                History.create("App Version Created", req,ObjectName.APP_VERISON,versionDetail?.id);
              })
            // API response
            res.json(Response.OK, { message: "Version Added"})
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, { message: err.message, })
        }
    };

    static async search(req, res, next) {


        let { page, pageSize, search, sort, sortDir, pagination,status,appId } = req.query;

        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            return res.json(Response.BAD_REQUEST, { message: "Invalid page" });
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            return res.json(Response.BAD_REQUEST, { message: "Invalid page size" });
        }

        const companyId = Request.GetCompanyId(req);

        // Sortable Fields
        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            id: "id",
            name: "name",
            status: "status",
            app_id: "app_id",
        };

        const sortParam = sort || "name";

        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(Response.BAD_REQUEST, { message: `Unable to sort app by ${sortParam}` });
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            return res.json(Response.BAD_REQUEST, { message: "Invalid sort order" });
        }

        let where = {};

        where.company_id = companyId;
        where.app_id = appId;
  if (status) {
    where.status = status === App.STATUS_ACTIVE_TEXT ? App.STATUS_ACTIVE : App.STATUS_INACTIVE;
  }

        // Search term
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

        const query = {
            order: [
                [[sortParam, sortDirParam]],
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
            const appVersionList = await appVersion.findAndCountAll(query);

            const list = [];

            if (ArrayList.isArray(appVersionList?.rows)) {
                for (let i = 0; i < appVersionList?.rows.length; i++) {
                    const { id, name, status,createdAt,updatedAt,app_id} = appVersionList?.rows[i];

                    list.push({
                        id: id,
                        name: name,
                        status: status == App.STATUS_ACTIVE ? App.STATUS_ACTIVE_TEXT : status == App.STATUS_INACTIVE ? App.STATUS_INACTIVE_TEXT : "",
                        statusId: status,
                        app_id: app_id,
                        createdAt: createdAt,
                        updatedAt: updatedAt,
                    })
                }
            }


            res.json(Response.OK, {
                totalCount: appVersionList.count,
                currentPage: page,
                pageSize,
                data: list,
                search,
                sort,
                sortDir,
            });
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, { message: err.message });
        }


    }

    static async update(req, res, next) {
        try {
            let data = req.body;
            let companyId = Request.GetCompanyId(req);
    
            let isAlreadyExist = await appVersion.findOne({
                where: {
                    id : data.id,
                    company_id: companyId
                }
            });
    
            if (!isAlreadyExist) {
                return res.json(Response.BAD_REQUEST, { message: "Record Not Found" });
            }
    
            let updateData = {
                name: data?.name,
                app_id: data?.app_id,
            };
        
            const save = await appVersion.update(updateData, {
                where: {
                    company_id: companyId,
                    id:  data?.id 
                }
            });
    
            res.json(Response.UPDATE_SUCCESS, { message: "Version Updated", data: save });
        } catch (error) {
            next(error);
        }
    }
    

    static async delete(req, res, next) {
        let { id } = req.params;
        let companyId = Request.GetCompanyId(req);

        let data = await appVersion.findOne({
            where: {
                id: id,
                company_id: companyId
            }
        })

        if (!data) {
            return res.json(Response.BAD_REQUEST, { message: "Record Not Found" })
        }

        await data.destroy();

        res.json(Response.DELETE_SUCCESS, { message: "Version Deleted"});

    }

// Tag Status update route
 static async updateVersionStatus (req, res, next) { 
    try {
        const data = req.body;
        const { id } = req.params;
        let company_id = Request.GetCompanyId(req)

        // Validate tag id
        if (!id) {
            return res.json(Response.BAD_REQUEST, { message: "App Version id is required" })
        }

        // Validate tag status
        if(!data) {
            return res.json(Response.BAD_REQUEST, { message: "App Version status is required" })
        }

        // Update tag status
        const updateStatus = {
            status : data == "Active" ? App.STATUS_ACTIVE : App.STATUS_INACTIVE,
        };

        await appVersion.update(updateStatus, { where: { id, company_id } });

        History.create("App Version Updated", req);

        res.json(Response.UPDATE_SUCCESS, { message: "App Version Updated" })
    } catch (err) {
        console.log(err);
        res.json(Response.BAD_REQUEST, { message: err.message })
    }
}
   
}

module.exports = AppVersionService;