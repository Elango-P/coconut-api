// Models
const { Pages, status:statusModal } = require("../db").models;

// Lib
const Request = require("../lib/request");

// Module dependencies
const { BAD_REQUEST, OK} = require("../helpers/Response");

const ObjectName = require("../helpers/ObjectName");
const History = require("./HistoryService");
const Url = require("../lib/Url");

const { Op } = require("sequelize");
const Boolean = require("../lib/Boolean");

const validator = require(".././lib/validator");
const StatusService = require("./StatusService");

class PageService {

static async create(req, res){
    try {
        const data = req.body;

        const companyId = Request.GetCompanyId(req);

        // Validate Page name
        if (!data.name) {
            return res.json(BAD_REQUEST, { message: "Page Name is required" })
        }

        // Validate Page Url 
        if (!data.url) {
            return res.json(BAD_REQUEST, { message: "Page Url is required" })
        }
 // Validate duplicate product brand name
        const name = data.name.trim();
        const pageExist = await Pages.findOne({
        where: { name, company_id : companyId },
});
if (pageExist) {
    return res.json(BAD_REQUEST, { message: "Page name already exist" });
}
        // Page data
        const pageData = {
            name: data.name,
            url: data.url,
            status: await StatusService.getFirstStatus(ObjectName.PAGE,companyId),
            company_id: companyId,
        };

        // Create Page
        await Pages.create(pageData);

        // API response
        res.json(OK, { message: "Page added" })
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message : err.message })
    }
}

 static async search(req, res){
     try {
        let { page, pageSize, search, sort, sortDir, pagination } = req.query;

        const companyId = Request.GetCompanyId(req);

        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            return res.json(BAD_REQUEST, { message: "Invalid page", })
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            return res.json(BAD_REQUEST, { message: "Invalid page size", })
        }

        // Sortable Fields
        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            id: "id",
            name: "name",
            url: "url",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const sortParam = sort || "name";

        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(BAD_REQUEST, { message: `Unable to sort product by ${sortParam}`, })
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            return res.json(BAD_REQUEST, { message: "Invalid sort order", })
        }

        const where = {};

        //  Search by term
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

        // Query
        const query = {
            attributes: ["id", "name", "url"],
            order: [[sortParam, sortDirParam]],
            where: {
                 ...where,
                 company_id: companyId
                
                },
                include: [
                    {
                      required: false,
                      model: statusModal,
                      as: "statusDetail",
                    }
                  ]
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

        // Get Pages list and count
        const pagesList = await Pages.findAndCountAll(query);

        // Defining an Empty list to store the list values
        const data = [];

        // Looping the lists based on query
        pagesList.rows.forEach((page) => {
            const { id, name, url, statusDetail } = page;

            // Pushing the list values into data in array format. 
            data.push({ id, name, url, status: statusDetail?.name, colorCode: statusDetail?.color_code,statusId: statusDetail?.id  });
        })

        res.json(OK, { totalCount: pagesList.count, currentPage: page, pageSize, data, search, sort, sortDir });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
 }
static async get(req, res){
    try {
        const { id } = req.params;

        const company_id = Request.GetCompanyId(req);

        const pageDetails = await Pages.findOne({
            where : { id : id, company_id: company_id },
        });

        if (!pageDetails) {
            return res.json(400, { message : "Page not found" });
        };

        const data = {
            id: pageDetails.id,
            name: pageDetails.name,
            url: pageDetails.url,
            content: pageDetails.content ? Url.RawURLDecode(pageDetails.content) : "",
            status: pageDetails.status,
            company_id: pageDetails.company_id,
            createdAt: pageDetails.createdAt,
            updatedAt: pageDetails.updatedAt,
        };

        res.json(200, { data : data });
    } catch (err) {
        console.log(err);
    }
}

static async update(req, res){
    try {
        const { id } = req.params;

        const company_id = Request.GetCompanyId(req);

        const data = req.body;

        const name = data.name;

        const url = data.url;



        // Get Page Details
        const pageDetails = await Pages.findOne({
            where : { id : id, company_id: company_id },
        });

        if (!pageDetails) {
            return res.json(400, { message : "Page not found" });
        };

        // Updating the Page Details
        pageDetails.update({
            content : Url.RawURLEncode(data.content),name, url
        });


        res.json(200, { message : "Page updated" });
    } catch (err) {
        console.log(err);
    };
}


 static async delete(req, res){
    try {
        //get company Id from request
        let pageId = req.params.id;

        //get company Id from request
        const companyId = Request.GetCompanyId(req);

        //validate Order Id exist or not
        if (!pageId) {
            return res.json(400, { message: "Page Not Found" });
        }

        //delete Page
        await Pages.destroy({ where: { id: pageId, company_id: companyId } });

        res.on("finish", async () => {
            History.create("Page Deleted", req, ObjectName.PAGE, pageId);
        })

        res.json(200, { message: "Page Deleted" });

    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
 }
  
 static async statusUpdate(req, res){
    try {
        const { id } = req.params;

        const company_id = Request.GetCompanyId(req);

        const data = req.body;
        const pageDetails = await Pages.findOne({
            where : { id : id, company_id: company_id },
        });

        if (!pageDetails) {
            return res.json(400, { message : "Page not found" });
        };

        pageDetails.update(data);

        res.json(200, { message : "Page updated" });
    } catch (err) {
        console.log(err);
    };
}
 
}
 
module.exports = PageService;