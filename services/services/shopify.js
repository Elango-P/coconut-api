const request = request("request");
const  asyncRequest = request("request-promise");

const { shopifyAdminAPI, convertToShopifyProductData } = request("../../lib/utils");

module.exports = {
    createProduct: async (store_id, data, callback) => {
        request(
            {
                url: await shopifyAdminAPI(store_id, "products.json"),
                method: "POST",
                json: true,
                body: convertToShopifyProductData(data),
            },
            function(error, response, body) {
                if (error) {
                    return callback(error);
                }

                return callback(null, body && body.product ? body.product : "");
            }
        );
    },

    /**
     *  Update Product In Shopify
     *
     * @param productId
     * @param data
     * @param callback
     */
    updateProduct: async (store_id, productId, data, callback) => {
        request(
            {
                url: await shopifyAdminAPI(
                    store_id,
                    `products/${productId}.json`
                ),
                method: "PUT",
                json: true,
                body: convertToShopifyProductData(data),
            },
            function(error, response, body) {
                return callback(
                    error,
                    body && body.product ? body.product : ""
                );
            }
        );
    },

    /**
     * Delete product in shopify
     *
     * @param productId
     * @param callback
     */
    deleteProduct: async (store_id, productId, callback) => {
        request(
            {
                url: await shopifyAdminAPI(
                    store_id,
                    `products/${productId}.json`
                ),
                method: "DELETE",
                json: true,
            },
            function(error, response, body) {
                if (error) {
                    return callback(error);
                }

                return callback(null);
            }
        );
    },

    /**
     * Create product image in Shopify
     */
    createProductImage: async (store_id, productId, image, callback) => {
        request(
            {
                url: await shopifyAdminAPI(
                    store_id,
                    `products/${productId}/images.json`
                ),
                method: "POST",
                json: true,
                body: { image },
            },
            function(error, response, body) {
                return callback(error, body && body.image ? body.image : "");
            }
        );
    },

    /**
     * Update product image in Shopify
     */
    updateProductImage: async (
        store_id,
        productId,
        imageId,
        image,
        callback
    ) => {
        request(
            {
                url: await shopifyAdminAPI(
                    store_id,
                    `products/${productId}/images/${imageId}.json`
                ),
                method: "PUT",
                json: true,
                body: { image },
            },
            function(error, response, body) {
                return callback(error, body && body.image ? body.image : "");
            }
        );
    },

    /**
     * Delete product image in Shopify
     */
    deleteProductImage: async (store_id, productId, imageId, callback) => {
        request(
            {
                url: await shopifyAdminAPI(
                    store_id,
                    `products/${productId}/images/${imageId}.json`
                ),
                method: "DELETE",
                json: true,
            },
            function(error, response, body) {
                return callback(error, body && body.image ? body.image : "");
            }
        );
    },

    /**
     * Get orders
     */
    getOrder: async store_id => {
        if (!store_id) {
            throw { message: "Location id is required" };
        }

        try {
            const options = {
                url: await shopifyAdminAPI(store_id, "orders.json"),
                method: "GET",
                json: true,
            };

            const ordersDetails = await asyncRequest(options);

            return ordersDetails && ordersDetails.orders
                ? ordersDetails.orders
                : null;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Get customers by store
     */
    getCustomer: async store_id => {
        if (!store_id) {
            throw { message: "Location id is required" };
        }

        try {
            const options = {
                url: await shopifyAdminAPI(store_id, "customers.json"),
                method: "GET",
                json: true,
            };

            const customerDetails = await asyncRequest(options);

            return customerDetails && customerDetails.customers
                ? customerDetails.customers
                : null;
        } catch (err) {
            throw err;
        }
    },
};
