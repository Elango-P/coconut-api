/**
 * Module dependencies
 */
const { Op } = require("sequelize");

const { account } = require("../../db").models;

/**
 * Check whether account exist or not
 *
 * @param {*} vendorBaseUrl
 */
const isExistByVendorUrl = async url => {
    const baseUrl = url.match(/^https?:\/\/[^#?\/]+/)[0];
    const splitUrl = baseUrl.split(".");

    const vendorName = splitUrl[splitUrl.length - 2];

    const vendorDetails = await account.findOne({
        where: { url: { [Op.like]: `%${vendorName}%` } },
    });

    if (!vendorDetails) return false;

    return vendorDetails;
};

/**
 * Get account id
 *
 * @params vendorBaseUrl
 */
const getVendorId = async vendorBaseUrl => {
    if (!vendorBaseUrl) {
        return null;
    }

    const Vendor = await account.findOne({
        where: { url: vendorBaseUrl },
    });

    // Validate account name exist
    if (Vendor) {
        return Vendor.id;
    } else {
        const newVendorData = {
            name: vendorBaseUrl,
            url: vendorBaseUrl,
        };

        // Create new account
        const newVendor = await account.create(newVendorData);
        return newVendor.id;
    }
};

module.exports =  {
    getVendorId,
    isExistByVendorUrl,
};
