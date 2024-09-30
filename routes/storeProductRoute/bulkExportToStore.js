/**
 * Module dependencies
 */

const async = require("async");
const { Op } = require("sequelize");

// Models
const { BAD_REQUEST, OK, UNAUTHORIZED } = require("../../helpers/Response");

// Services
const { createProduct, updateProduct } = require("../../services/ShopifyService");
const productService = require("../../services/ProductService");
const locationProductService = require("../../services/locationProductService");

const String = require("../../lib/string");

const {
    STORE_PRODUCT_EXPORT_STATUS_PENDING,
    STORE_PRODUCT_EXPORT_STATUS_EXPORTED,
} = require("../../helpers/StoreProduct");

/**
 * Get store product with export status of PENDING or Null
 *
 * @param {*} storeProductIds
 */
const getExportStoreProductIds = async storeProductIds => {
    const ids = [];
    const options = {
        $or: [
            { export_status: STORE_PRODUCT_EXPORT_STATUS_PENDING },
            { export_status: null },
        ],
    };

    const storeProducts = await locationProductService.getAllStoreProductById(
        storeProductIds,
        options
    );

    if (!storeProducts.count) {
        return ids;
    }

    storeProducts.rows.forEach(storeProduct => {
        ids.push(storeProduct.id);
    });

    return ids;
};

/**
 * Product create in shopify route
 */
 async function bulkExportToStore (req, res, next){

    const companyId = req.user.company_id;

    const data = req.body;
    const { storeProductIds } = data;

    // Validate product
    if (!storeProductIds) {
       return res.json(BAD_REQUEST, {  message: "Store product(s) required",})
    }

    if (!storeProductIds.length) {
        return res.json(BAD_REQUEST, { message: "Store product(s) required" ,})
    }

    const ids = await getExportStoreProductIds(storeProductIds);
    
    // API response
    res.json(OK, { message: "Product(s) exported",})

    res.on("finish", () => {
        async.eachSeries(
            ids,
            async (id, cb) => {
                try {
                    const storeProduct = await locationProductService.getStoreProductDetails(
                        id
                    );

                    if (!storeProduct) {
                        return cb();
                    }

                    const {
                        product_id: productId,
                        store_id,
                    } = storeProduct;

                    if (!store_id) return cb();

                    const productDetails = await productService.getProductDetails(
                        productId,
                        store_id,
                        companyId
                    );
                    const { images, slug } = productDetails;

                    // Sort image with there position
                    images.sort((a, b) => a.position - b.position);

                    // Store Data
                    const locationDetails = {
                        title: productDetails.name,
                        handle: productDetails.slug
                            ? productDetails.slug
                            : String.convertTextToSlug(productDetails.name),
                        product_type: productDetails.productCategoryName,
                        vendor: productDetails.productBrandName,
                        tags: productDetails.productTagNames,
                        body_html: productDetails.description,
                        weight: productDetails.weight,
                        weight_unit: productDetails.weight_unit,
                        sku: productDetails.sku,
                        inventory_policy: productDetails.sellOutOfStockLabel,
                        taxable: productDetails.taxable,
                        price: productDetails.price,
                        quantity: productDetails.shopify_quantity,
                        published: productDetails.status,
                    };

                    if (productId) {
                        // Update Product In Store
                        updateProduct(
                            store_id,
                            productId,
                            locationDetails,
                            async (err, exportedStoreProduct) => {
                                if (err) {
                                    return cb();
                                }

                                await locationProductService.updateStoreProduct(
                                    store_id,
                                    productId,
                                    {
                                        exportStatus: STORE_PRODUCT_EXPORT_STATUS_EXPORTED,
                                    }
                                );
                                productService.updateProductImageInShopify(
                                    store_id,
                                    productId,
                                    images
                                );
                                cb();
                            }
                        );
                    } else {
                        // Create Product In Store
                        createProduct(
                            store_id,
                            locationDetails,
                            async (err, exportedStoreProduct) => {
                                if (err) {
                                    return cb();
                                }

                                await productService.updateProducts(productId, {
                                    slug,
                                }, companyId);
                                await locationProductService.updateStoreProduct(
                                    store_id,
                                    productId,
                                    {
                                        exportStatus: STORE_PRODUCT_EXPORT_STATUS_EXPORTED,
                                        storeProductId:
                                            exportedStoreProduct &&
                                            exportedStoreProduct.id,
                                    }
                                );
                                productService.exportProductImageInShopify(
                                    store_id,
                                    exportedStoreProduct.id,
                                    images
                                );
                                return cb();
                            }
                        );
                    }
                } catch (err) {
                   
                }
            },
            () => {}
        );
    });
};

module.exports = bulkExportToStore;
