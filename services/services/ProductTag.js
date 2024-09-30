/**
 * Module dependencies
 */

const async = require("async");

// Models
const { product_tag } = require("../../db").models;

module.exports = {
    /**
     * Bulk Create Product Tag
     */
    bulkCreate: async (product_id, tags, callBack) => {
        if (tags.length < 0) {
            return callBack();
        }

        async.eachSeries(
            tags,
            async (tag, cb) => {
                const tag_id = tag.tagId;

                // Get Product Tag Exists
                const productTagExists = await product_tag.findOne({
                    where: { product_id, tag_id },
                });

                // Get Product Tag
                if (productTagExists) {
                    return callBack();
                }

                // Product Tag Data
                const productTagData = { product_id, tag_id };

                // Create Product Tag
                await product_tag.create(productTagData).then(() => cb());
            },
            () => callBack()
        );
    },

    /**
     * Bulk Remove Product Tag
     */
    bulkRemove: async (product_id, tags, callBack) => {
        if (tags.length < 0) {
            return callBack();
        }

        async.eachSeries(
            tags,
            async (tag, cb) => {
                const tag_id = tag.tagId;

                // Get Product Tag Exists
                const productTagExists = await product_tag.findOne({
                    where: { product_id, tag_id },
                });

                // Not Product Tag Exists
                if (!productTagExists) {
                    return callBack();
                }

                // Delete Product Tag
                await product_tag
                    .destroy({ where: { product_id, tag_id } })
                    .then(() => cb());
            },
            () => callBack()
        );
    },
};
