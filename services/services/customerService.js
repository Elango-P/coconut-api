const Sequelize = require("sequelize");

const DateTime = require("../../lib/dateTime");
const utils = require("../../lib/utils");

// services
const shopifyService = require("./shopify");

const { customer: customerModel, Location  } = require("../../db").models;

/**
 * Check whether customer exist or not
 *
 * @param customerId
 * @returns false if not exist else order details
 */
const isExistById = async customerId => {
    if (!customerId) {
        throw { message: "Customer id is required" };
    }

    const customerDetails = await customerModel.findOne({
        where: { id: customerId },
    });

    if (!customerDetails) {
        return false;
    }

    return customerDetails;
};

/**
 * Get customers from Location
 * @param storeId
 */
const getStoreCustomer = async storeId => {
    const customers = await shopifyService.getCustomer(storeId);
    return customers;
};

/**
 * Import Location customer
 *
 * @param storeId
 */
const importCustomer = async storeId => {
    if (!storeId) {
        throw { message: "Location id is required" };
    }

    const customers = await getStoreCustomer(storeId);

    // Create each customers in customer table
    for (let customer of customers) {
        try {
            const createData = {
                storeCustomerId: customer.id,
                firstName: customer.first_name,
                lastName: customer.last_name,
                email: customer.email,
                phone: customer.phone,
                orderCounts: customer.order_counts,
                state: customer.state,
                totalSpent: customer.total_spent,
                lastOrderId: customer.last_order_id,
                note: customer.note,
                verifiedEmail: customer.verified_email,
                tags: customer.tags,
                currency: customer.currency,
                addresses: customer.addresses,
                storeId,
            };

            await createCustomer(createData);
        } catch (err) {
            continue;
        }
    }
};

/**
 * Create customer
 *
 * @param data
 */
const createCustomer = async data => {
    if (!data) {
        throw { message: "Customer details required" };
    }

    // Validate customer if already exist
    const customerExist = await customerModel.count({
        where: {
            store_customer_id: data.storeCustomerId,
            store_id: data.storeId,
        },
    });

    if (customerExist) {
        throw { message: "Customer already exist" };
    }

    const createData = {
        store_customer_id: data.storeCustomerId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        order_counts: data.orderCounts,
        state: data.state,
        total_spent: data.totalSpent,
        last_order_id: data.lastOrderId,
        note: data.note,
        verified_email: data.verifiedEmail,
        tags: data.tags,
        currency: data.currency,
        addresses: data.addresses,
        store_id: data.storeId,
    };

    return await customerModel.create(createData);
};

/**
 * Search customer
 *
 * @param {*} params
 */
const searchCustomer = async params => {
    let { page, pageSize, search, sort, sortDir, pagination } = params;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
        throw { message: "Invalid page" };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
        throw { message: "Invalid page size" };
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
        first_name: "first_name",
        last_name: "last_name",
        email: "email",
        phone: "phone",
        order_counts: "order_counts",
        total_spent: "total_spent",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    let where = {};

    if (params.store_id) {
        where.store_id = params.store_id;
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            Sequelize.where(
                Sequelize.fn(
                    "concat",
                    Sequelize.col("first_name"),
                    " ",
                    Sequelize.col("last_name")
                ),
                {
                    $like: `%${searchTerm}%`,
                }
            ),
            {
                email: {
                    $like: `%${searchTerm}%`,
                },
            },
            {
                phone: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
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

    // Get customer list and count
    const customer = await customerModel.findAndCountAll(query);

    // Return customer is null
    if (customer.count === 0) {
        return null;
    }

    const customerData = [];

    customer.rows.forEach(customer => {
        const { createdAt, updatedAt, first_name, last_name } = customer;

        const customerDetails = { ...customer.get() };

        customerDetails.createdAt = DateTime.defaultDateFormat(createdAt);
        customerDetails.updatedAt = DateTime.defaultDateFormat(updatedAt);
        customerDetails.name = utils.concatName(first_name, last_name);

        customerData.push(customerDetails);
    });

    return {
        totalCount: customer.count,
        currentPage: page,
        pageSize,
        data: customerData,
        sort,
        sortDir,
        search,
    };
};

/**
 * Get customer list
 *
 * @param customerId
 */
const getCustomerById = async customerId => {
    const customerExist = await isExistById(customerId);

    if (!customerExist) {
        throw { message: "Customer not found" };
    }

    const customerDetails = await customerModel.findOne({
        where: { id: customerId },
        include: [
            {
                required: true,
                model: Location,
                as: "location",
                attributes: ["id", "name"],
            },
        ],
    });

    return customerDetails;
};

/**
 * Update customer by id
 *
 * @param {*} customerId
 * @param {*} data
 */
const updateCustomer = async (customerId, data) => {
    if (!customerId) {
        throw { message: "Customer id is required" };
    }

    if (!data) {
        throw { message: "Customer details is required" };
    }

    const customerDetails = await isExistById(customerId);

    if (!customerDetails) {
        throw { message: "Customer not found" };
    }

    // Validate customer if already exist
    const where = {
        id: { $ne: customerId },
        store_customer_id: data.storeCustomerId,
    };
    const existCustomer = await customerModel.count({ where });

    if (existCustomer) {
        throw { message: "Customer already exist" };
    }

    const updateCustomerData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        order_counts: data.orderCounts,
        state: data.state,
        total_spent: data.totalSpent,
        last_order_id: data.lastOrderId,
        note: data.note,
        verified_email: data.verifiedEmail,
        tags: data.tags,
        currency: data.currency,
        addresses: data.addresses,
        store_id: data.storeId,
        store_customer_id: data.storeCustomerId,
    };

    await customerModel.update(updateCustomerData, {
        where: { id: customerId },
    });
};

/**
 * Delete customer by id
 *
 * @param customerId
 */
const deleteCustomer = async customerId => {
    const customerExist = await isExistById(customerId);

    if (!customerExist) {
        throw { message: "Customer not found" };
    }

    await customerModel.destroy({
        where: { id: customerId },
    });
};

export default {
    importCustomer,
    createCustomer,
    searchCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};
