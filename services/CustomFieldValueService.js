const { BAD_REQUEST, OK, UPDATE_SUCCESS } = require('../helpers/Response');
const Boolean = require('../lib/Boolean');
const { CustomFieldValue, CustomField: CustomFieldModel } = require('../db').models;
const validator = require('../lib/validator');
const DateTime = require("../lib/dateTime");
const CustomForm = require('../helpers/CustomForm');
const MediaService = require('./MediaService');

class CustomFieldValueService {

    static async create(body, companyId) {
        try {

            const { customFieldValues, objectId, objectName } = body;

            if (!objectId) {
                throw { message: "object Id Is Required" }
            }

            if (!objectName) {
                throw { message: "object Name Id Is Required" }
            }

            if (!customFieldValues) {
                throw { message: "Custom Field Value Is Required" }
            }


            for (const [key, value] of Object.entries(customFieldValues)) {

                let formFieldDataExist = await CustomFieldValue.findOne({
                    where: { company_id: companyId, object_id: objectId, object_name: objectName, custom_field_id: key }
                })

                if (formFieldDataExist) {
                    await CustomFieldValue.update({
                        value: value,
                        company_id: companyId
                    }, {
                        where: { company_id: companyId, id: formFieldDataExist.id }
                    });
                } else {

                    await CustomFieldValue.create({
                        custom_field_id: key,
                        value: value,
                        company_id: companyId,
                        object_id: objectId,
                        object_name: objectName
                    });
                }
            }

        } catch (err) {
            console.log(err);
        }
    }

    static async search(queryParams, params, companyId) {
        try {
            let { page, pageSize, pagination, objectId, objectName, tagId } = queryParams;

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

            const where = {};

            if (objectId) {
                where.object_id = objectId
            }

            if (objectName) {
                where.object_name = objectName;
            }

            where.company_id = companyId;

            const query = {
                where,
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: CustomFieldModel,
                        as: "customFieldDetail",
                        where: { tag_id: tagId }
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
            const customFieldValue = await CustomFieldValue.findAndCountAll(query);

            let data = []

            const CustomFieldList = customFieldValue && customFieldValue.rows;

            for (let i = 0; i < CustomFieldList.length; i++) {

                const { id, object_id, custom_field_id, object_name, value, createdAt, customFieldDetail } = CustomFieldList[i];

                let list = {
                    id: id,
                    customFieldId: custom_field_id,
                    objectId: object_id,
                    objectName: object_name,
                    value: value,
                    type: customFieldDetail ? customFieldDetail.type : "",
                    createdAt: DateTime.shortDateAndTime(createdAt),
                }
                data.push(list)
            }

            return {
                data,
            };

        } catch (err) {
            console.log(err);
        }
    }

    static async get(query, params, companyId) {
        try {

            const { objectName } = query;

            const { id,timeZone } = params;

            let formFieldData = new Array();

            let where = new Object();

            if (!id) {
                return res.json(BAD_REQUEST, { message: "Inspection Id Is required" });
            }

            where.object_id = id;

            where.company_id = companyId;

            if (objectName) {
                where.object_name = objectName
            }

            let customFieldValueList = await CustomFieldValue.findAll({
                where,
                include: [
                    {
                        model: CustomFieldModel,
                        as: "customFieldDetail",
                    }
                ]
            })

            if (customFieldValueList && customFieldValueList.length > 0) {

                let formData;

                let dataType;

                for (let i = 0; i < customFieldValueList.length; i++) {

                    formData = {
                        id: customFieldValueList[i].id,
                        objectId: customFieldValueList[i].object_id,
                        customFieldId: customFieldValueList[i].custom_field_id,
                        value: customFieldValueList[i].value,
                        objectName: customFieldValueList[i].object_name
                    }

                    dataType = customFieldValueList[i].customFieldDetail && customFieldValueList[i].customFieldDetail.type;

                    formData.type = dataType;

                    if (dataType == CustomForm.TYPE_FILE_UPLOAD && customFieldValueList[i].value) {
                        formData.mediaUrl = await MediaService.getMediaURL(customFieldValueList[i].value, companyId);
                    }

                    if (dataType == CustomForm.TYPE_DATE && customFieldValueList[i].value) {
                        formData.value = DateTime.getDateTimeByUserProfileTimezone(customFieldValueList[i].value,timeZone);;
                    }

                    formFieldData.push(formData);

                }
            }

            return { data: formFieldData }
        } catch (err) {
            console.log(err);
            throw { message: err.message }
        }
    }


    static async update(params, body, companyId) {
        try {
            const { formId, customFieldValues, formDataId } = body

            if (!formId) {
                throw { message: "Form Id Is Required" }
            }

            if (!customFieldValues) {
                throw { message: "Custom Field Value Is Required" }
            }

            if (!formDataId) {
                throw { message: "form Data Id Is Required" }
            }

            for (const [key, value] of Object.entries(customFieldValues)) {

                let formFieldDataExist = await CustomFieldValue.findOne({
                    where: { company_id: companyId, custom_form_id: formId, custom_form_data_id: formDataId, custom_form_field_id: key }
                })

                if (formFieldDataExist) {

                    await CustomFieldValue.update({
                        value: value,
                        company_id: companyId
                    }, {
                        where: { company_id: companyId, custom_form_id: formId, custom_form_data_id: formDataId, custom_form_field_id: key }
                    });
                } else {
                    await CustomFieldValue.create({
                        custom_form_id: formId,
                        custom_form_field_id: key,
                        value: value,
                        custom_form_data_id: formDataId,
                        company_id: companyId
                    });
                }
            }


        } catch (err) {
            console.log(err);
        }
    }

    static async del(query, params, companyId) {
        try {

            const { id } = params;

            if (!id) {
                throw { message: "Custom Form Data Id Is Required" }
            }

            let customFormFieldDataList = await CustomFieldValue.findAll({
                where: { company_id: companyId, custom_form_data_id: id }
            })

            if (customFormFieldDataList && customFormFieldDataList.length > 0) {
                for (let i = 0; i < customFormFieldDataList.length; i++) {
                    await CustomFieldValue.destroy({
                        where: { id: customFormFieldDataList[i].id, company_id: companyId }
                    })
                }
            }

            await CustomFieldValue
                .destroy({
                    where: { id: id, company_id: companyId }
                })

            return true;

        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = CustomFieldValueService;
