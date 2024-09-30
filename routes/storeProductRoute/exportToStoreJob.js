/**
 * Module dependencies
 */

const async = require("async");

// Models
const { OK } = require("../../helpers/Response");

// Services
const { createProduct, updateProduct } = require("../../services/ShopifyService");
const productService = require("../../services/ProductService");
const locationProductService = require("../../services/locationProductService");

// Utils
const { STORE_PRODUCT_EXPORT_STATUS_EXPORTED }  = require("../../helpers/StoreProduct");

const String = require("../../lib/string");

/**
 * location product export job route
 */
 async function exportToStore(req, res, next){

    const companyId = req.user.company_id;

    // API response
    res.json(OK, {  message: "Product(s) exported",});

    res.on("finish", () => {
        async.eachSeries(
            storeProducts,
            async (storeProduct, cb) => {
                try {
                    console.log(storeProduct.get());
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

                    // location Data
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
                        sale_price: productDetails.sale_price,
                        quantity: productDetails.shopify_quantity,
                        published: productDetails.status,
                    };

                    if (productId) {
                        // Update Product In location
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
                        // Create Product In location
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
                                cb();
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

module.exports = exportToStore;
