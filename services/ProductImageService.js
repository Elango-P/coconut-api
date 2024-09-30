const async = require("async");

// Util
const {
    getMediaUrl,
    getS3ObjectUrl,
} = require("../lib/Url");

const String = require("../lib/string");

const { renameFile, uploadFile, UploadFromUrlToS3 } = require("../lib/s3");
const { defaultDateFormat } = require("../lib/dateTime");

const {
    PRODUCT_IMAGE_PATH,
    PRODUCT_IMAGE_STATUS_ACTIVE,
    PRODUCT_IMAGE_SHOPIFY_STATUS_PENDING,
    PRODUCT_IMAGE_SHOPIFY_STATUS_NEW,
    PRODUCT_IMAGE_STATUS_INACTIVE,
    PRODUCT_IMAGE_SHOPIFY_STATUS_EXPORTED,
} = require("../helpers/ProductImage");

// Services
const dbService = require("../lib/dbService");
const locationProductService = require("./locationProductService");
const { STORE_PRODUCT_EXPORT_STATUS_PENDING } = require("../helpers/StoreProduct");

const { product, productMedia, Media: MediaModel } = require("../db").models;

// Constants
const productConstants = require("../helpers/Product")

const { Media } = require("../helpers/Media");
const History = require("../services/HistoryService");
const ObjectName = require("../helpers/ObjectName");

/**
 * Check whether product image exist or not
 *
 * @param {*} productImageId
 * @returns {*} false if not exist else details
 */
const isExist = async productImageId => {
    if (!productImageId) {
        throw { message: "Product image id is required" };
    }

    const productImageDetails = await productMedia.findOne({
        where: { id: productImageId },
    });

    if (!productImageDetails) {
        return false;
    }

    return productImageDetails.get();
};

/**
 * Get product image details
 *
 * @param {*} productImageId
 */
const getProductImage = async productImageId => {
    if (!productImageId) {
        throw { message: "Product image id is required" };
    }

    const productImageDetails = await isExist(productImageId);

    if (!productImageDetails) {
        throw { message: "Product image not found" };
    }

    return productImageDetails;
};

/**
 * Get product image S3 URL by product id
 *
 * @param {*} productId
 */
const getImageUrlByProductId = async productId => {
    const productImage = await getProductImageByProductId(productId);

    const images = [];

    if (productImage.count) {
        productImage.rows.forEach(product => {
            const { id, position, file_name, name, status } = product;

            // Media Path
            const imagePath = `${PRODUCT_IMAGE_PATH}/${productId}/${file_name}`;
            const imageUrl = file_name ? getS3ObjectUrl(imagePath) : null;

            images.push({
                id,
                productId,
                name,
                imageUrl,
                file_name,
                position,
                status,
            });
        });
    }

    return images;
};

/**
 * Get product images by product id
 *
 * @param {*} productId
 * @returns {Object} { count, data }
 */
const getProductImageByProductId = async productId => {
    if (!productId) {
        throw { message: "Product id is required" };
    }

    const productImages = await productMedia.findAndCountAll({
        where: { product_id: productId },
    });

    return productImages;
};

/**
 * Update product image details
 *
 * @param {*} productImageId
 * @param {*} data
 */
const updateProductImage = async (productImageId, data) => {
    if (!productImageId) {
        throw { message: "Product image id is required" };
    }

    const productImageDetails = await isExist(productImageId);

    if (!productImageDetails) {
        throw { message: "Product image not found" };
    }

    const updateData = {};

    if (data.status) {
        updateData.status = data.status;
    }

    if (data.position) {
        updateData.position = data.position;
    }

    if (data.name && data.name !== productImageDetails.name) {
        await renameImageFile(productImageId, data.name);
        updateData.name = data.name;
    }

    // Find and replace image name
    if (data.findImageName) {
        await findAndReplaceImageName(
            productImageId,
            data.findImageName,
            data.replaceImageName
        );
    }

    const save = await productMedia.update(updateData, {
        where: { id: productImageId },
        returning: true,
        plain: true,
    });

    return save;
};

/**
 * Rename image file name and update in S3
 *
 * @param {*} productImageId
 * @param {*} newImageName`
 */
const renameImageFile = async (productImageId, newImageName) => {
    if (!newImageName) {
        throw { message: "New image name is required" };
    }

    const productImageDetails = await getProductImage(productImageId);

    const currentFilePath = `${PRODUCT_IMAGE_PATH}/${productImageDetails.product_id}/${productImageDetails.file_name}`;

    const newFileName = `${String.formattedName(newImageName)}-${productImageId}.png`;
    const newFilePath = `${PRODUCT_IMAGE_PATH}/${productImageDetails.product_id}/${newFileName}`;

    renameFile(currentFilePath, newFilePath, () => { });

    // Update product image file_name
    const save = await productMedia.update(
        { file_name: newFileName },
        {
            where: { id: productImageId },
        }
    );

    return save;
};

/**
 * Find and replace image name by id
 *
 * @param {*} productImageId
 * @param {*} findImageName
 * @param {*} replaceImageName
 */
const findAndReplaceImageName = async (
    productImageId,
    findImageName,
    replaceImageName
) => {
    dbService.updateUsingFindAndReplace(
        productImageId,
        "product_media",
        "name",
        findImageName,
        replaceImageName,
        async () => {
            const productImageDetails = await getProductImage(productImageId);
            const newImageName = productImageDetails.name;

            await renameImageFile(productImageId, newImageName);
        }
    );
};

/**
 * Create Product Image
 *
 * @param productId
 * @param images
 * @param name
 * @param callback
 * @returns {*}
 */
const createProductImage = (productId, images, name, companyId, callback) => {
    try {
        if (!images) {
            return callback({ message: "Product image not found" });
        }

        if (!images.length) {
            return callback({ message: "Product image not found" });
        }

        async.eachSeries(
            images,
            async (image, cb) => {

                let index = images.indexOf(image);

                let fileName = name && String.replaceSpecialCharacter(name);

                let medaiData = {
                    name: name,
                    file_name: fileName,
                    visibility: Media.VISIBILITY_PUBLIC,
                    company_id: companyId
                };

                let MediaData = await MediaModel.create(medaiData)

                // Create Product Image
                await productMedia.create({
                    product_id: productId,
                    media_id: MediaData.id,
                    company_id: companyId,
                    feature: index == 0 ? productConstants.FEATURE_ENABLED : productConstants.FEATURE_DISABLED
                })

                const mediaId = MediaData.id;

                const imagePath = `${mediaId}-${fileName}`;

                // Media Upload In S3
                UploadFromUrlToS3((image && image.src) || image, imagePath).then(() => cb())

                    .catch(err => callback(err));
            });

        return callback(null);

    } catch (err) {
        return callback(null)
    }
};

/**
 * Add image in a product from image URL
 *
 * @param {*} productId
 * @param {*} imageUrl
 */
const addProductImageFromUrl = async (productId, imageUrl) => {
    if (!productId) {
        throw { message: "Product id is required" };
    }

    if (!imageUrl) {
        throw { message: "Image URL is required" };
    }

    const productImages = await getProductImageByProductId(productId);

    const position = ++productImages.count;

    const image = await productMedia.create({
        product_id: productId,
        position,
    });

    const productDetails = await product.findOne({
        where: { id: productId },
        attributes: ["name"],
    });

    const mediaName = `${String.formattedName(productDetails.name)}-${image.id}.png`;
    const imagePath = `${PRODUCT_IMAGE_PATH}/${productId}/${mediaName}`;

    // Media Upload In S3
    await uploadFile(imageUrl, imagePath, () => { });

    await productMedia.update(
        {
            name: productDetails.name,
            file_name: mediaName,
        },
        { where: { id: image.id } }
    );

    // Add image in store_product
    const storeProducts = await locationProductService.getStoreProductByProductId(
        productId
    );

    if (storeProducts.count) {
        storeProducts.rows.forEach(async storeProduct => {
            await locationProductService.updateStoreProductById(storeProduct.id, {
                storeId: storeProduct.store_id,
                productId,
                exportStatus: STORE_PRODUCT_EXPORT_STATUS_PENDING,
            });
        });
    }
};

/**
 * Delete product image
 *
 * @param {*} productImageId
 */
const deleteProductImage = async productImageId => {
    if (!productImageId) {
        throw { message: "Product image id is required" };
    }

    const productImageDetails = await isExist(productImageId);

    if (!productImageDetails) {
        throw { message: "Product image not found" };
    }

    const productDetails = await product.findOne({
        where: { id: productImageDetails.product_id },
        attributes: ["shopify_product_id"],
    });

    return await productMedia.destroy({ where: { id: productImageId } });
};

/**
 * Delete all the product images which associated with the
 * given product id
 *
 * @param {*} productId
 */
const deleteAllImageByProductId = async (productId, companyId) => {
    if (!productId) {
        throw { message: "Product id is required" };
    }

    return await productMedia.destroy({
        where: { product_id: productId, company_id: companyId },
    });
};

/**
 * Search product image
 *
 * @param {*} params
 */
const searchProductImage = async params => {
    let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        productId,
        status,
        shopifyStatus,
    } = params;

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
        id: "id",
        name: "name",
        productName: "name",
        position: "position",
        status: "status",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    };

    const sortParam = sort || "status";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
    }

    const data = params;

    let where = {};

    const order = [
        [sortableFields[sortParam], sortDirParam],
        ["position", "ASC"],
    ];

    // Search by product id
    if (productId) {
        where = { product_id: productId };
        order.shift();
    }

    // Search by name
    const name = data.name;
    if (name) {
        where.name = {
            $like: `%${name}%`,
        };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
        where.$or = [
            {
                name: {
                    $like: `%${searchTerm}%`,
                },
            },
        ];
    }

    // Filter by status
    if (status) {
        where.status = status;
    }

    const query = {
        attributes: { exclude: ["deletedAt"] },
        order,
        where,
    };

    if (pagination) {
        if (pageSize > 0) {
            query.limit = pageSize;
            query.offset = (page - 1) * pageSize;
        }
    }

    // Get Product image list and count
    const productImages = await productMedia.findAndCountAll(query);

    // Return product image is null
    if (productImages.count === 0) {
        return [];
    }

    const productImageData = [];

    let productImageList = productImages.rows;


    for (let i = 0; i < productImageList.length; i++) {
        const {
            product_id,
            file_name,
            createdAt,
            updatedAt,
        } = productImageList[i];
        const productImage = { ...productImageList[i].get() };

        let products;

        if (product_id) {
            products = await product.findOne({
                where: { id: product_id }
            })
        }


        // formate object property
        productImage.url = file_name
            ? getMediaUrl(product_id, file_name)
            : null;
        productImage.productName = (products && products.name) || "";
        productImage.createdAt = defaultDateFormat(createdAt);
        productImage.updatedAt = defaultDateFormat(updatedAt);

        productImageData.push(productImage);
    }

    return {
        totalCount: productImages.count,
        currentPage: page,
        pageSize,
        data: productImageData,
        sort,
        sortDir,
        search,
    };
};

let createIndexData = {};
const createIndex = async (data) => {
    const imageData = {
        feature: data.feature,
        object_id: data.product_id,
        object_name: ObjectName.PRODUCT
    }
    return await MediaModel.update(imageData, { where: { id: data.media_id, company_id: data.company_id } });
};
const reindexAll = async (companyId, req) => {
    History.create("Product Media Reindex : Reindex All function Triggered", req);
    const productMediaData = await productMedia.findAll({
        where: { company_id: companyId },
    });
    if (!productMediaData) return null;

    History.create(
        "Product Media Reindex : Taking product Media data from product Media Table",
        req
    );
    return productMediaData.forEach(async (data) => {
        try {
            // Create index record
            await createIndex(data);
        } catch (err) {
            History.create(`Product Reindex Error :${err} `, req);
        }
    });
};


module.exports = {
    isExist,
    getProductImage,
    getImageUrlByProductId,
    getProductImageByProductId,
    updateProductImage,
    renameImageFile,
    createProductImage,
    deleteProductImage,
    deleteAllImageByProductId,
    searchProductImage,
    addProductImageFromUrl,
    reindexAll
};
