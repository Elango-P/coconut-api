const { Op } = require("sequelize");
const App = require("../helpers/App");
const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const ArrayList = require("../lib/ArrayList");
const Request = require("../lib/request");
const history = require("./HistoryService");
const { App: appModel } = require("../db").models;
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");





class AppService {

    static async create(req, res, next) {
        let data = req.body;
        let companyId = Request.GetCompanyId(req);

        let isAlreadyExist = await appModel.findOne({
            where: {
                name: data?.name?.trim(),
                company_id: companyId
            }
        })

        if (isAlreadyExist) {
            return res.json(Response.BAD_REQUEST, { message: "Record Already Exist" })
        }

        let createData = {
            name: data?.name?.trim(),
            name_space: data?.nameSpace?.trim(),
            status: data?.status,
            company_id: companyId
        }

        await appModel.create(createData).then((createRes) => {
            res.json(Response.OK, { message: "App Created" });
            res.on("finish", async () => {
                history.create(`App Created`, req, ObjectName.APP, createRes?.id);
            });
        })

    }

    static async search(req, res, next) {

        let { page, pageSize, search, sort, sortDir, pagination, status } = req.query;

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
            name_space: "name_space",
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

        if (status === App.STATUS_ACTIVE_TEXT) {
            where.status = App.STATUS_ACTIVE
        }
        else if (status === App.STATUS_INACTIVE_TEXT) {
            where.status = App.STATUS_INACTIVE
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
                {
                    name_space: {
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
            const appList = await appModel.findAndCountAll(query);

            const list = [];

            if (ArrayList.isArray(appList?.rows)) {
                for (let i = 0; i < appList?.rows.length; i++) {
                    const { id, name, status, name_space } = appList?.rows[i];

                    list.push({
                        id: id,
                        name: name,
                        status: status == App.STATUS_ACTIVE ? App.STATUS_ACTIVE_TEXT : status == App.STATUS_INACTIVE ? App.STATUS_INACTIVE_TEXT : "",
                        statusId: status,
                        statusColor: status == App.STATUS_ACTIVE ? "green" : status == App.STATUS_INACTIVE ? "red" : "",
                        nameSpace: name_space
                    })
                }
            }


            res.json(Response.OK, {
                totalCount: appList.count,
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

        let data = req.body;
        let companyId = Request.GetCompanyId(req);


        let isAlreadyExist = await appModel.findOne({
            where: {
                id: data?.id,
                company_id: companyId
            }
        })

        if (!isAlreadyExist) {
            return res.json(Response.BAD_REQUEST, { message: "Record Not Found" })
        }

        let updateData = {
            name: data?.name?.trim(),
            name_space: data?.nameSpace?.trim(),
            status: data?.status,
        }
        isAlreadyExist.update(updateData).then((upRes) => {
            res.json(Response.OK, { message: "App Updated" });
            res.on("finish", async () => {
                history.create(`App Updated`, req, ObjectName.APP, upRes?.id);
            });
        })
    }

    static async del(req, res, next) {
        let { id } = req.body;
        let companyId = Request.GetCompanyId(req);


        let isAlreadyExist = await appModel.findOne({
            where: {
                id: id,
                company_id: companyId
            }
        })

        if (!isAlreadyExist) {
            return res.json(Response.BAD_REQUEST, { message: "Record Not Found" })
        }

        isAlreadyExist.destroy().then((delRes) => {
            res.json(Response.OK, { message: "App Deleted" });
            res.on("finish", async () => {
                history.create(`App Deleted`, req, ObjectName.APP, delRes?.id);
            });
        })

    }


    static async get(req, res, next) {
        let { id } = req.query;
        let companyId = Request.GetCompanyId(req);


        let isAlreadyExist = await appModel.findOne({
            where: {
                id: id,
                company_id: companyId
            }
        })

        if (!isAlreadyExist) {
            return res.json(Response.BAD_REQUEST, { message: "Record Not Found" })
        }

        res.json(Response.OK, {
            data: isAlreadyExist
        })
    }
}

module.exports = AppService;