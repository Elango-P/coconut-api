const { Op } = require("sequelize");
const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const ArrayList = require("../lib/ArrayList");
const Request = require("../lib/request");
const history = require("./HistoryService");
const { Holiday: holidayModel } = require("../db").models;
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");
const Holiday = require("../helpers/Holiday");

class HolidayService {

    static async create(req, res, next) {
        let data = req.body;
        let companyId = Request.GetCompanyId(req);

        let isAlreadyExist = await holidayModel.findOne({
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
            date: data?.date,
            type: data?.type,
            company_id: companyId
        }

        await holidayModel.create(createData).then((createRes) => {
            res.json(Response.OK, { message: "Holiday Created" });
            res.on("finish", async () => {
                history.create(`Holiday Created`, req, ObjectName.HOLIDAY, createRes?.id);
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
            date: "date",
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
            const holidayList = await holidayModel.findAndCountAll(query);

            const list = [];

            if (ArrayList.isArray(holidayList?.rows)) {
                for (let i = 0; i < holidayList?.rows.length; i++) {
                    const { id, name, date, type } = holidayList?.rows[i];

                    list.push({
                        id: id,
                        name: name,
                        date: date,
                        typeId: type,
                        type: type === Holiday.COMPULSORY_VALUE ? Holiday.COMPULSORY_TEXT : Holiday.OPTIONAL_VALUE ? Holiday.OPTIONAL_TEXT : ""
                    })
                }
            }

            res.json(Response.OK, {
                totalCount: holidayList.count,
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

        let isAlreadyExist = await holidayModel.findOne({
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
            date: data?.date,
            type: data?.type
        }

        isAlreadyExist.update(updateData).then((upRes) => {
            res.json(Response.OK, { message: "Holiday Updated" });
            res.on("finish", async () => {
                history.create(`Holiday Updated`, req, ObjectName.HOLIDAY, upRes?.id);
            });
        })
    }

    static async del(req, res, next) {
        let id = req.params.id;
        let companyId = Request.GetCompanyId(req);


        let isAlreadyExist = await holidayModel.findOne({
            where: {
                id: id,
                company_id: companyId
            }
        })

        if (!isAlreadyExist) {
            return res.json(Response.BAD_REQUEST, { message: "Record Not Found" })
        }

        isAlreadyExist.destroy().then((delRes) => {
            res.json(Response.OK, { message: "Holiday Deleted" });
            res.on("finish", async () => {
                history.create(`Holiday Deleted`, req, ObjectName.HOLIDAY, delRes?.id);
            });
        })
    }

    static async get(req, res, next) {
        let { id } = req.params;
        let companyId = Request.GetCompanyId(req);


        let isAlreadyExist = await holidayModel.findOne({
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

module.exports = HolidayService;