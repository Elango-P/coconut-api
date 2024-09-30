
const ObjectName = require("../helpers/ObjectName");
const { OK, BAD_REQUEST, UPDATE_SUCCESS } = require("../helpers/Response");
const Currency = require("../lib/currency");
const DateTime = require("../lib/dateTime");
const Request = require("../lib/request");
const History = require("./HistoryService");
const {status , Sprint } = require("../db").models;
const statusService = require("./StatusService");
const Response = require("../helpers/Response");
const { Op } = require("sequelize");
const {  STATUS_ACTIVE, STATUS_ACTIVE_TEXT, STATUS_IN_ACTIVE_TEXT } = require("../helpers/Sprint");
const Boolean = require("../lib/Boolean");
const validator = require(".././lib/validator");

class sprintService {
    // Create a new paymentService
    static async create(req, res,next) {
        try {
            //get company Id from request
            let body = req.body;
        
            const company_id = Request.GetCompanyId(req);
        
        
            let sprintCreateData = {
              company_id: company_id,
              name: body.name,
              status: STATUS_ACTIVE,
              start_date: DateTime.formateDateAndTime(body.start_date),
              end_date: DateTime.formateDateAndTime(body.end_date),
            };
        
            let sprintDetails = await Sprint.create(sprintCreateData);
        
            res.json(200, {
              message: "Sprint Added",
              sprintDetails: sprintDetails,
            });
        
            res.on("finish", () => {
              // Create system log for sprint creation
              History.create("Sprint Added", req, ObjectName.SPRINT, sprintDetails.id);
            });
        
          }
          catch (err) {
            console.log(err);
              return res.json(400, { message: err.message });
          }
    }

    // delete

    static async del(req, res) {

        let sprintId = req.params.id;
        try {

        // Get company Id from request

        // Get company Id from request
        const companyId = Request.GetCompanyId(req);

        // Validate sprint Id exist or not
        if (!sprintId) {
            return res.json(400, { message: "Sprint Not Found" });
        }

        // Delete sprint
        await Sprint.destroy({ where: { id: sprintId, company_id: companyId } });

        res.json(200, { message: "Sprint Deleted" });

        // History On Finish Function
        res.on(("finish"), async () => {
            History.create("Sprint Deleted", req, ObjectName.SPRINT, sprintId);
        })

    } catch (err) {
        console.log(err);
            return res.json(400, { message: err.message });
    }
    }

    //get

    static async get(req, res, next) {
        const { id } = req.params;

        try {
            // Get the company Id
            const company_id = Request.GetCompanyId(req);
    
            if (!id) {
                return res.json(400, { message: "Invalid Id" });
            }
    
            const sprintData = await Sprint.findOne({
                where: {
                    id: id,
                    company_id: company_id,
                },
            });
    
            if (!sprintData) return res.json(200, { message: "No Records Found" });
            let { name, status, start_date, end_date } = sprintData.get();
            
    
            let data = {
                name,
                status:status === STATUS_ACTIVE ? STATUS_ACTIVE_TEXT:STATUS_IN_ACTIVE_TEXT,
                start_date,
                end_date,
            };
    
            res.json(200, data);
        } catch (err) {
            next(err);
            console.log(err);
        }
    }
    

    // Update 
    static async update(req, res) {
        const data = req.body;
        const { id } = req.params;
        const company_id = Request.GetCompanyId(req);

        const name = data.name;
        try {
            const sprintData = await Sprint.findOne({
                where: { id, company_id },
            });
    
    
            //update sprint details
            const sprintDetails = {
                name: name,
                start_date: DateTime.formateDateAndTime(data.start_date),
                end_date: DateTime.formateDateAndTime(data.end_date),
            };
            const save = await sprintData.update(sprintDetails);
    
    
            // API response
            res.json(UPDATE_SUCCESS, { message: "sprint Updated", data: save.get(), })
    
            // History On Finish Function
            res.on(("finish"), async () => {
                History.create("Sprint Updated", req, ObjectName.SPRINT, id);
            })
    
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, { message: err.message, })
        }


    }

    //search
    static async search(req, res, next) {

        try {

            let { page, pageSize, search, sort, sortDir, pagination } = req.query;
    
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
                return res.json(400, { message: "Company Not Found" });
            }
    
            // Sortable Fields
            const validOrder = ["ASC", "DESC"];
            const sortableFields = {
                id:"id",
                name: "name",
                status: "status",
                start_date: "start_date",
                end_date: "end_date",
                createdAt: "createdAt",
                updatedAt: "updatedAt",
    
            };
    
            const sortParam = sort || "name";
            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
                return res.json(BAD_REQUEST, {
                    message: `Unable to sort by ${sortParam}`,
                });
            }
    
            const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
                return res.json(BAD_REQUEST, { message: "Invalid sort order" });
            }
    
            const data = req.query;
    
            const where = {};
    
            where.company_id = companyId;
    
            if (data.status) {
                where.status = data.status;
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
    
            // Get sprint list and count
            const sprintDetails = await Sprint.findAndCountAll(query);
    
            // Return sprint is null
            if (sprintDetails.count === 0) {
                return res.json({});
            }
    
            const sprintData = [];
    
            sprintDetails.rows.forEach((sprintDetail) => {
    
                sprintData.push({
                    id: sprintDetail.id,
                    status:sprintDetail.status === STATUS_ACTIVE ? STATUS_ACTIVE_TEXT:STATUS_IN_ACTIVE_TEXT ,
                    name: sprintDetail.name,
                    start_date: sprintDetail.start_date,
                    end_date: sprintDetail.end_date,
                });
            });
    
            res.json(OK, {
                totalCount: sprintDetails.count,
                currentPage: page,
                pageSize,
                data: sprintData,
                search,
            });
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, { message: err.message });
        }
    }
    static updateStatus = async (req, res, next) => {
        const data = req.body;
        const { id } = req.params;
        // Validate Vendor id
        if (!id) {
            return res.json(Response.BAD_REQUEST, { message: "Sprint   id is required" });
        }
    
       
        // Update Vendor status
        const updateSprintType = {
           status: data.status,
        };
    
        try {
            const save = await Sprint.update(updateSprintType, { where: {id: id }});
    
            res.json(Response.UPDATE_SUCCESS, {  
               message: "Sprint updated",
               });
    
            res.on("finish", async () => {
               History.create(`"Sprint Status updated"`, req, ObjectName.FineType, save.id);
    
    
           })
    
            // API response
            
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, {  
                message: err.message
            });
        }
    }

    static async list(req, res, next) {

        try {
    
            const companyId = req.user && req.user.company_id;
    
            if (!companyId) {
                return res.json(400, { message: "Company Not Found" });
            }
    
            // Sortable Fields
            const validOrder = ["ASC", "DESC"];
            const sortableFields = {
                name: "name",
                status: "status",
                start_date: "start_date",
                end_date: "end_date",
                createdAt: "createdAt",
                updatedAt: "updatedAt",
    
            };
    
            
            const data = req.query;
    
            const where = {};
    
            where.company_id = companyId;
            where.status === STATUS_ACTIVE
            // Search term
          
            const query = {
                order: [["name", "ASC"]],
                where,
            };
    
           
            // Get sprint list and count
            const sprintDetails = await Sprint.findAndCountAll(query);
    
            // Return sprint is null
            if (sprintDetails.count === 0) {
                return res.json({});
            }
    
            const sprintData = [];
    
            sprintDetails.rows.forEach((sprintDetail) => {
    
                sprintData.push({
                    id: sprintDetail.id,
                    name: sprintDetail.name,
                    
                });
            });
    
            res.json(OK, {
                totalCount: sprintDetails.count,
               
                data: sprintData,

            });
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, { message: err.message });
        }
    }
}





module.exports = {
    sprintService
};
