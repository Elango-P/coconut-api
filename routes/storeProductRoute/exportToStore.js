/**
 * Module dependencies
 */

// Models
const { BAD_REQUEST, OK, UNAUTHORIZED } = require("../../helpers/Response");

// Services
const { createProduct, updateProduct } = require("../../services/ShopifyService");
const productService = require("../../services/ProductService");
const locationProductService = require("../../services/locationProductService");

const String = require("../../lib/string");

const { STORE_PRODUCT_EXPORT_STATUS_EXPORTED } = require("../../helpers/StoreProduct");

/**
 * Get store product with export status of PENDING or Null
 *
 * @param {*} storeProductId
 */
const getExportStoreProductId = async storeProductId => {
    let id;

    const storeProducts = await locationProductService.getAllStoreProductById([
        storeProductId,
    ]);

    if (!storeProducts.count) {
        return id;
    }

    storeProducts.rows.forEach(storeProduct => {
        id = storeProduct.id;
    });

    return id;
};

/**
 * Product create in shopify route
 */
async function exportToStore (req, res, next){

    const companyId = req.user.company_id;

    const data = req.body;
    const { storeProductId } = data;

    // Validate storeProductId
    if (!storeProductId) {
       return res.json(BAD_REQUEST, { message: "Store product id is required",})
    }

    const id = await getExportStoreProductId(storeProductId);

    try {
        const storeProduct = await locationProductService.getStoreProductDetails(
            id
        );

        if (!storeProduct) {
            return res.json(BAD_REQUEST, { message: "Store product not found",});
        }

        const {
            product_id: productId,
            store_id,
        } = storeProduct;

        if (!store_id) {
            return res.json(BAD_REQUEST, { message: "Location not found",});
        }

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
                        return res.json(BAD_REQUEST, { message: err.message,});
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

                 res.json(OK, { message: "Product exported",});
                }
            );
        } else {
            // Create Product In Store
            createProduct(
                store_id,
                locationDetails,
                async (err, exportedStoreProduct) => {
                    if (err) {
                       return res.json(BAD_REQUEST, { message: err.message,});
                    }

                    await productService.updateProduct(productId, {
                        slug,
                    });
                    await locationProductService.updateStoreProduct(
                        store_id,
                        productId,
                        {
                            storeProductId:
                                exportedStoreProduct && exportedStoreProduct.id,
                        }
                    );
                    productService.exportProductImageInShopify(
                        store_id,
                        exportedStoreProduct.id,
                        images
                    );

                    res.json(OK, {message: "Product exported",});
                }
            );
        }
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, {message: err.message,});
    }
};

module.exports = exportToStore;
