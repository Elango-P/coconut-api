/**
 * Module dependencies
 */
const util = require("../../lib/utils");
const { Op } = require("sequelize");

const DateTime = require("../../lib/dateTime");
const { VENDOR_BIGBASKET_URL, VENDOR_JIOMART_URL}= require("../../helpers/VendorImport");

const { supplier_product, supplierProductMedia } = require("../../db").models;

// Services
const productService = require("./product");

const { getProductBrandId } = require("./productBrand");
const { getProductCategoryId } = require("./productCategory");
const accountService = require("../AccountService");
const bigbasketImport = require("./import/bigBasket");
const jiomartImport = require("./import/jioMart");

/**
 * Scrape Vendor product details page
 *
 * @param {*} url
 * @param {*} vendorUrl
 */
const getVendorProductFromUrl = async (url, vendorUrl) => {
    const VENDOR_URL = vendorUrl.toLowerCase();

    try {
        if (VENDOR_URL.includes(VENDOR_BIGBASKET_URL)) {
            return await bigbasketImport(url);
        } else if (VENDOR_URL.includes(VENDOR_JIOMART_URL)) {
            return await jiomartImport(url);
        } else {
            throw { message: "Vendor import not found" };
        }
    } catch (err) {
        throw err;
    }
};

/**
 * Check whether vendor product exist or not
 *
 * @param {*} vendorProductId
 * @returns {*} false if not exist else product details
 */
const isExist = async vendorProductId => {
    const productDetails = await supplier_product.findOne({
        where: { id: vendorProductId },
    });

    if (!productDetails) {
        return false;
    }

    return productDetails;
};

/**
 * Find all vendor product by Ids
 *
 * @param {Array} ids
 * @returns array of products
 */
const findAllProducts = async ids => {
    if (!ids) {
        throw { message: "Product id is required" };
    }

    if (!ids.length) {
        throw { message: "Product id is required" };
    }

    const products = await supplier_product.findAll({
        where: { id: { [Op.in]: ids } },
    });

    if (!products.length) {
        throw { message: "Product not found" };
    }

    return products;
};

/**
 * Get vendor product details by id
 *
 * @param {*} vendorProductId
 */
const getVendorProductById = async vendorProductId => {
    if (!vendorProductId) {
        throw { message: "Vendor product id is required" };
    }

    const productDetails = await supplier_product.findOne({
        where: { id: vendorProductId },
        attributes: { exclude: ["deletedAt"] },
        include: [
            {
                required: false,
                model: supplierProductMedia,
                as: "supplierProductImages",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
            },
        ],
    });

    if (!productDetails) {
        throw { message: "Vendor product not found" };
    }

    const { price, supplierProductImages, createdAt, updatedAt } = productDetails;
    const data = { ...productDetails.get() };
    delete data.supplierProductImage;

    let images = [];
    if (supplierProductImages && supplierProductImages.length > 0) {
        supplierProductImages.forEach(image => {
            images = image.image_url;
        });
    }

    // formate object property
    data.images = images;
    data.price = price || "";
    data.createdAt = DateTime.defaultDateFormat(createdAt);
    data.updatedAt = DateTime.defaultDateFormat(updatedAt);

    return data;
};

/**
 * Update vendor product image
 *
 * @param {*} vendorProductId
 * @param {*} image
 */
const updateProductImage = async (vendorProductId, image) => {
    // Delete existing vendor product images
    await supplierProductMedia.destroy({
        where: { supplier_product_id: vendorProductId },
    });

    // Create vendor product image
    const productImage = {
        supplier_product_id: vendorProductId,
        image_url: image,
    };

    return await supplierProductMedia.create(productImage);
};

/**
 * Update product details in master product
 *
 * @param {*} currentDetails
 * @param {*} newDetails
 */
const updateInMasterProduct = async (currentDetails, newDetails) => {
    const updateData = {};

    if (
        newDetails.price &&
        currentDetails.price !== parseFloat(newDetails.price, 10)
    ) {
        updateData.price = newDetails.price;
    }

    if (
        newDetails.sale_price &&
        currentDetails.sale_price !== parseInt(newDetails.sale_price, 10)
    ) {
        updateData.sale_price = newDetails.sale_price;
    }

    if (Object.keys(updateData).length) {
        await productService.updateProduct(
            currentDetails.product_id,
            updateData
        );
    }
};

/**
 * Update vendor product details
 *
 * @param {*} id
 * @param {*} data
 */
const updateProduct = async (id, data) => {
    if (!id) {
        throw { message: "Vendor product id is required" };
    }

    const productExist = await isExist(id);

    if (!productExist) {
        throw { message: "Vendor product not found" };
    }

    if (data.brandName) {
        data.brandId = await getProductBrandId(data.brandName);
    }

    if (data.categoryName) {
        data.categoryId = await getProductCategoryId(data.categoryName);
    }

    const updateProductData = {
        name: data.name,
        vendor_id: data.vendorId,
        description: data.description,
        product_id: data.productId,
        price: data.price,
        sale_price: data.salePrice,
        url: data.url,
        status: data.status,
        barcode: data.barcode,
        brand_id: data.brandId,
        category_id: data.categoryId,
        last_updated_at: data.lastUpdatedAt,
        import_status: data.importStatus,
        imported_at: data.importedAt,
    };

    const productDetails = await supplier_product.update(updateProductData, {
        where: { id },
    });

    if (data.images && data.images.length > 0) {
        productDetails.images = await updateProductImage(id, data.images);
    }

    if (productExist.product_id)
        await updateInMasterProduct(productExist, updateProductData);

    return productDetails;
};

/**
 * Create new vendor product
 *
 * @param {*} data
 */
const createProduct = async data => {
    const vendorUrl = util.removeQueryStringFromUrl(data.url);

    // Validate vendor url is exist
    const exist = await supplier_product.findOne({ where: { url: vendorUrl } });
    if (exist) {
        throw { message: "Vendor product already exist" };
    }

    if (data.brandName) {
        data.brandId = await getProductBrandId(data.brandName);
    }

    if (data.categoryName) {
        data.categoryId = await getProductCategoryId(data.categoryName);
    }

    if (data.vendorBaseUrl) {
        data.vendorId = await accountService.getVendorId(data.vendorBaseUrl);
    }

    const createProductData = {
        name: data.name,
        vendor_id: data.vendorId,
        description: data.description,
        product_id: data.productId,
        price: data.price,
        sale_price: data.salePrice,
        url: vendorUrl,
        status: data.status,
        barcode: data.barcode,
        brand_id: data.brandId,
        category_id: data.categoryId,
        last_updated_at: data.lastUpdatedAt,
        import_status: data.importStatus,
        imported_at: data.importedAt,
    };

    const product = await supplier_product.create(createProductData);

    if (data.images && data.images.length > 0) {
        product.images = await updateProductImage(product.id, data.images);
    }

    return product;
};

/**
 * Delete vendor product by id
 *
 * @param {*} id
 */
const deleteProduct = async id => {
    if (!id) {
        throw { message: "Vendor product id is required" };
    }

    // Validate vendor product
    const exist = await isExist(id);
    if (!exist) {
        throw { message: "Vendor product not found" };
    }

    return await supplier_product.destroy({ where: { id } });
};

/**
 * Check whether vendor product exist or not by name
 *
 * @param {*} vendorProductName
 * @returns {*} false if not exist else product details
 */
const isExistByName = async vendorProductName => {
    const productDetails = await supplier_product.findOne({
        where: { name: vendorProductName },
    });

    if (!productDetails) {
        return false;
    }

    return productDetails;
};

/**
 *  Create Vendor Product
 *
 * @param {*} data
 */
const createVendorProduct = async data => {
    const name = data.name;
    const vendorProductDetails = await isExistByName(name);
    if (vendorProductDetails) {
        throw { message: "Vendor product already exist" };
    }

    const createData = {
        name,
    };

    const vendorProductData = await supplier_product.create(createData);

    return vendorProductData;
};

module.exports = {
    getVendorProductFromUrl,
    isExist,
    findAllProducts,
    getVendorProductById,
    updateProduct,
    createProduct,
    deleteProduct,
    createVendorProduct,
};
