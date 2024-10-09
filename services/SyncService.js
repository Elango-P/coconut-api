// Util
const { Op } = require("sequelize");
const DateTime = require("../lib/dateTime");

const { sync, ProductPrice, productIndex, status,OrderType } = require("../db").models;

const History = require("../services/HistoryService");

const ObjectName = require("../helpers/ObjectName")

const Number = require("../lib/Number");
const Status = require("../helpers/Status");

const productPrice = require("../helpers/ProductPrice");
const AttendanceService = require("./AttendanceService");
const ShiftService = require("./ShiftService");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const StatusService = require("../services/StatusService");
const Setting = require("../helpers/Setting");

/**
 * Check whether sync exist or not by object_id
 * and object_name
 *
 * @param {*} objectId
 * @param {*} ObjectName
 * @param {*} name
 * @returns {*} false if not exist else details
 */
const isExistByObjectId = async (objectId, objectName, name, companyId) => {
    try {
        if (!objectId) {
            throw { message: "Sync object id is required" };
        }

        if (!objectName) {
            throw { message: "Sync object name is required" };
        }

        if (!name) {
            throw { message: "Sync name is required" };
        }

        const syncDetails = await sync.findOne({
            where: { object_id: objectId, object_name: objectName, name, company_id: companyId },
        });

        if (!syncDetails) {
            return false;
        }

        return syncDetails.get();
    } catch (err) {
        console.log(err);
    }
};

/**
 *  Create sync
 *
 * @param {*} data
 */
const createSync = async (data, companyId) => {
    try {
        const createData = {
            name: data.name,
            object_name: data.objectName,
            object_id: data.objectId,
            status: data.status,
            result: data.result,
            company_id: companyId
        };

        const syncData = await sync.create(createData);

        return syncData;
    } catch (err) {
        console.log(err);
    }
};

/**
 * Update sync by object_id and object_name
 *
 * @param {*} objectId
 * @param {*} objectName
 * @param {*} name
 * @param {*} data
 */
const updateSyncByObjectId = async (objectId, objectName, name, data, companyId) => {

    try {
        if (!objectId) {
            throw { message: "Sync object id is required" };
        }

        if (!objectName) {
            throw { message: "Sync object name is required" };
        }

        if (!name) {
            throw { message: "Sync name is required" };
        }

        const syncDetails = await isExistByObjectId(objectId, objectName, name, companyId);

        if (!syncDetails) {
            throw { message: "Sync not found" };
        }
        const updateData = {
            name: data.name,
            object_name: data.objectName,
            object_id: data.objectId,
            status: data.status,
            result: data.result,
        };

        const save = await sync.update(updateData, {
            where: { object_id: objectId, object_name: objectName, name, company_id: companyId },
        });

        return save;
    } catch (err) {
        console.log(err);
    }
};

/**
 * Delete sync object
 *
 * @param {*} objectId
 * @param {*} objectName
 * @param {*} name
 */
const deleteSyncObject = async (objectId, objectName, name, companyId) => {
    try {
        if (!objectId) {
            throw { message: "Sync object id is required" };
        }

        if (!objectName) {
            throw { message: "Sync object name is required" };
        }

        if (!name) {
            throw { message: "Sync name is required" };
        }

        const syncDetails = await isExistByObjectId(objectId, objectName, name, companyId);

        if (!syncDetails) {
            throw { message: "Sync object not found" };
        }

        return await sync.destroy({ where: { id: syncDetails.id } });
    } catch (err) {
        console.log(err);
    }
};

/**
 * Search sync
 *
 * @param {*} params
 */
const searchSync = async params => {
    try {
        let { page, pageSize, search, sort, sortDir, pagination, status } = params;

        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            throw { message: "Invalid page" };
        }

        // Search in any page
        page = search ? 1 : page;

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            throw { message: "Invalid page size" };
        }

        // Sortable Fields
        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            id: "id",
            name: "name",
            objectName: "object_name",
            objectId: "object_id",
            status: "status",
            result: "result",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const sortParam = sort || "updatedAt";
        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            throw { message: `Unable to sort sync by ${sortParam}` };
        }

        const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            throw { message: "Invalid sort order" };
        }

        let where = {};

        // Search term
        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
            where.$or = [
                {
                    name: {
                        $like: `%${searchTerm}%`,
                    },
                },
                {
                    object_name: {
                        $like: `%${searchTerm}%`,
                    },
                },
                {
                    result: {
                        $like: `%${searchTerm}%`,
                    },
                },
            ];
        }

        // Filter by status
        if (status) {
            where.status = status;
        }

        // Filter by name
        if (params.name) {
            where.name = params.name;
        }

        const query = {
            attributes: { exclude: ["deletedAt"] },
            order: [[sortableFields[sortParam], sortDirParam]],
            where,
        };

        if (pagination) {
            if (pageSize > 0) {
                query.limit = pageSize;
                query.offset = (page - 1) * pageSize;
            }
        }

        // Get sync list and count
        const syncDetails = await sync.findAndCountAll(query);

        // Return sync is null
        if (syncDetails.count === 0) {
            return null;
        }

        const syncData = [];

        syncDetails.rows.forEach(syncDetail => {
            const { createdAt, updatedAt } = syncDetail;
            const data = { ...syncDetail.get() };

            // formate object property
            data.createdAt = DateTime.shortDateAndTime(createdAt);
            data.updatedAt = DateTime.shortDateAndTime(updatedAt);

            syncData.push(data);
        });

        return {
            totalCount: syncDetails.count,
            currentPage: page,
            pageSize,
            data: syncData,
            sort,
            sortDir,
        };
    } catch (err) {
        console.log(err);
    }
};


const syncToMobile = async (query, companyId,userId) => {
    try {
        const { barCode, productId, user_id } = query;



        const productList = [];

        const priceList = [];

        let productIds = [];

        let productWhere = {};

        let productPriceWhere = {};

        if (barCode) {
            productPriceWhere.barcode = barCode;
        }

        if (productId) {
            productPriceWhere.product_id = productId;
            productWhere.product_id = productId;
        }

        productWhere.company_id = companyId;

        productPriceWhere.company_id = companyId;

        const productPriceList = await ProductPrice.findAll(
            {
                where: productPriceWhere,
                include: [
                    {
                        required: true,
                        model: status,
                        as: "statusDetail",
                        where: { is_active_price: Status.IS_ACTIVE_PRICE }

                    }
                ]
            },

        );

        if (productPriceList && productPriceList.length > 0) {

            for (let i = 0; i < productPriceList.length; i++) {
                const {
                    id,
                    quantity,
                    unit_price,
                    product_id,
                    item,
                    amount,
                    mrp,
                    barcode,
                    cost_price,
                    sale_price,
                    is_default,
                    company_id,
                    status
                } = productPriceList[i];


                const data = {
                    id,
                    unit_price: unit_price,
                    quantity: quantity,
                    product_id: product_id,
                    item: item,
                    amount: amount,
                    mrp: Number.GetFloat(mrp),
                    costPrice: Number.GetFloat(cost_price),
                    barCode: barcode,
                    salePrice: Number.GetFloat(sale_price),
                    companyId: company_id,
                    isDefault: is_default == productPrice.IS_DEFAULT ? true : false,
                    status: productPrice.STATUS_ACTIVE
                };

                priceList.push(data);

                if (barCode && productIds.indexOf(product_id) == -1) {
                    productIds.push(product_id);
                }
            }
        }

        if (barCode && productIds.length > 0) {
            productWhere.product_id = { [Op.in]: productIds };
        }

        if ((barCode && productIds.length > 0) || !barCode || productId) {

            let products = await productIndex.findAll({ where: productWhere });

            if (products && products.length > 0) {

                for (let i = 0; i < products.length; i++) {
                    const {
                        product_id,
                        product_name,
                        size,
                        unit,
                        sale_price,
                        brand_name,
                        category_name,
                        brand_id,
                        category_id,
                        status,
                        featured_media_url,
                        max_quantity,
                        min_quantity,
                        quantity,
                        mrp,
                        cost,
                        tax_percentage,
                        image,
                        product_display_name,
                        createdAt,
                        updatedAt,
                        profit_amount,
                        profit_percentage,
                        allow_transfer_out_of_stock,
                        allow_sell_out_of_stock,
                        product_media_id,
                        company_id,
                        hsn_code,
                        pack_size,
                        print_name,
                        cgst_percentage,
                        sgst_percentage,
                        igst_percentage,
                        product_price_id,
                        manufacture,
                        cgst_amount,
                        sgst_amount,
                        productPrice
                    } = products[i];

                    const product = {
                        id: product_id,
                        name: product_name,
                        brand: brand_name,
                        brand_id: brand_id,
                        category_id: category_id,
                        size: size,
                        unit: unit,
                        cost: cost,
                        category: category_name,
                        sale_price: Number.GetFloat(sale_price),
                        image: featured_media_url,
                        mrp: Number.GetFloat(mrp),
                        tax_percentage: tax_percentage,
                        featured_media_url: image,
                        statusValue: status,
                        quantity: quantity,
                        min_quantity: min_quantity,
                        max_quantity: max_quantity,
                        product_display_name: product_display_name,
                        profit_amount: profit_amount,
                        profit_percentage: profit_percentage,
                        cgst_percentage: cgst_percentage,
                        sgst_percentage: sgst_percentage,
                        igst_percentage: igst_percentage,
                        allow_transfer_out_of_stock: allow_transfer_out_of_stock,
                        allow_sell_out_of_stock: allow_sell_out_of_stock,
                        product_media_id: product_media_id,
                        company_id: company_id,
                        hsn_code: hsn_code,
                        pack_size: pack_size,
                        print_name: print_name,
                        product_price_id: product_price_id,
                        manufacture: manufacture,
                        cgst_amount: cgst_amount,
                        sgst_amount: sgst_amount,
                        productPrice: productPrice,
                        createdAt: DateTime.defaultDateFormat(createdAt),
                        updatedAt: DateTime.defaultDateFormat(updatedAt)
                    };

                    productList.push(product);
                }
            }
        }


        // Get Status list and count
        const statusResults = await status.findAll({ where: { company_id: companyId } });

        const statusList = [];

        if (statusResults && statusResults.length > 0) {

            for (let i = 0; i < statusResults.length; i++) {

                const value = statusResults[i];

                statusList.push({
                    id: value.id,
                    name: value.name,
                    objectName: value.object_name,
                    objectId: value.object_id,
                    colorCode: value.color_code,
                    sortOrder: value.sort_order,
                    nextStatusIds: value.next_status_id,
                    allowedRoleIds: value.allowed_role_id,
                    updateQuantity: value.update_quantity,
                    companyId: value.company_id,
                    group: value.group,
                    allowEdit: value.allow_edit,
                    allow_product_add: value.allow_product_add,
                    defaultOwner:value?.default_owner && await StatusService.GetDefaultOwner(value?.default_owner, userId),
                    projectId: value.project_id,
                    allowCancel: value.allow_cancel,
                    update_transferred_quantity: value.update_transferred_quantity
                });
            }
        }

        const orderTypes = await OrderType.findAll({ where: { company_id: companyId } });
        const orderTypeList = [];
        if(orderTypes && orderTypes.length>0){
            for (const OrderTypeData of orderTypes) {
                orderTypeList.push({
                    name: OrderTypeData?.name,
                    id: OrderTypeData?.id,
                    companyId: OrderTypeData?.company_id,
                    show_customer_selection: OrderTypeData?.show_customer_selection,
                    allow_store_order: OrderTypeData?.allow_store_order ,
                    allow_delivery: OrderTypeData?.allow_delivery
                });
            }
        }
       

        return ({
            productList: productList,
            priceList: priceList,
            statusList: statusList,
            orderTypeList: orderTypeList,
        });

    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    createSync,
    deleteSyncObject,
    isExistByObjectId,
    updateSyncByObjectId,
    searchSync,
    syncToMobile
};
