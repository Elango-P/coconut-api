const { Op } = require('sequelize');
const ObjectName = require('../helpers/ObjectName');
const { BAD_REQUEST, OK, UPDATE_SUCCESS } = require('../helpers/Response');
const Request = require('../lib/request');
const History = require('./HistoryService');
const Boolean = require('../lib/Boolean');
const { CustomField } = require('../db').models;
const validator = require('../lib/validator');

class CustomFieldService {
    static async create(req, res, next) {
        try {
            const data = req.body;

            const companyId = Request.GetCompanyId(req);

            const createData = {
                tag_id: data?.tagId?data?.tagId:null,
                name: data?.name,
                type: data?.type,
                company_id: companyId,
                object_name: data.objectName,
            };

            let customField = await CustomField.create(createData);

            res.json(200, {
                message: 'Custom Field Created',
            });
            res.on('finish', async () => {
                History.create('Custom Field Created', req, ObjectName.CUSTOM_FORM_FIELD, customField.id);
            });
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, {
                message: err.message,
            });
        }
    }

    static async search(req, res, next) {

        try {
            
        let { page, pageSize, search, sort, sortDir, pagination, tagId, objectName } = req.query;
        const companyId = Request.GetCompanyId(req);
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

        if (!companyId) {
            return res.json(400, 'Company Not Found');
        }

        const where = {};

        if (tagId) {
            where.tag_id = tagId
        }

        if (objectName) {
            where.object_name = objectName;
        }

        where.company_id = companyId;

        const query = {
            order: [["sort_order", "ASC"]],
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
        const getCustomFormFieldDetails = await CustomField.findAndCountAll(query);

        if (getCustomFormFieldDetails.count === 0) {
            return res.json({ message: "Custom Field not found" });
        }

        let data = []
        const CustomFormFieldDetails = getCustomFormFieldDetails && getCustomFormFieldDetails.rows;
        for (let i = 0; i < CustomFormFieldDetails.length; i++) {
            const { id, type_id, name, type, sort_order, object_name } = CustomFormFieldDetails[i];

            let list = {
                id: id,
                type_id: type_id,
                name: name,
                type: type,
                sort_order: sort_order,
                objectName: object_name
            }
            data.push(list)
        }

        res.json(OK, {
            totalCount: getCustomFormFieldDetails.count,
            currentPage: page,
            pageSize,
            data,
            search,
            sort,
            sortDir,
        });

        } catch (error) {
            console.log(error);
        }
    }

    static async updateSortOrder(req, res) {
        const companyId = Request.GetCompanyId(req);
        try {
            const newOrder = req.body;
            for (let i = 0; i < newOrder.length; i++) {
                await CustomField.update({ sort_order: i + 1 }, {
                    where: {
                        id: newOrder[i].id,
                        company_id: companyId,
                    }
                });
            }
            res.json(OK, {
                message: 'Custom Field order updated.'
            });
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, { message: err.message });
        }
    }


    static async update(req, res, next) {

        let data = req.params;

        let body = req.body;

        const companyId = Request.GetCompanyId(req);
        try {

            if (!data?.id) {
                return res.json(400, 'Custom Field Id Not Found');
            }

            const customFormFieldDetails = await CustomField.findOne({
                where: { id: data?.id,  company_id: companyId },
            });

            if (!customFormFieldDetails) {
                return res.json(BAD_REQUEST, { message: "Custom Field Detail Not Found" });
            }

            let updateData = {}

            if (body && body?.name) {
                updateData.name = data?.name
            }
            if (body && body?.type) {
                updateData.type = data?.type
            }

            updateData.object_name = body.objectName;

            const save = await customFormFieldDetails.update(updateData);

            res.json(UPDATE_SUCCESS, {
                message: "Custom Field Updated",
                data: save.get(),
            });

            res.on("finish", async () => {
                History.create("Custom Field Updated", req, ObjectName.CUSTOM_FORM_FIELD, save.id);
            })
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, {
                message: err.message
            });
        }
    }


    static async delete(req, res, next) {

        try {

            let data = req.params;
            const companyId = Request.GetCompanyId(req);

            const customFormFieldDetails = await CustomField.findOne({
                where: { id: data?.id, company_id: companyId },
            });

            if (!customFormFieldDetails) {
                return res.json(BAD_REQUEST, { message: "Custom Field Detail Not Found" });
            }

            const del = await customFormFieldDetails.destroy();

            res.json(UPDATE_SUCCESS, {
                message: "Custom Field Deleted",
            });

            res.on("finish", async () => {
                History.create("Custom Field Deleted", req, ObjectName.CUSTOM_FORM_FIELD, del.id);
            })

        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, {
                message: err.message
            });
        }

    }
}

module.exports = CustomFieldService;
