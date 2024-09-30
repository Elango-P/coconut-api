/**
 * Module dependencies
 */

// Models
const { collection_product_tag } = require("../../db").models;

module.exports = {
    /**
     * Create Collection Product Tag
     */
    updateCollectionProductTag: async (collectionId, productTagType) => {
        try {
            // Delete existing product tags
            await collection_product_tag.destroy({
                where: { collection_id: collectionId },
                truncate: true,
            });

            // Create new product tags
            for (let tag of productTagType) {
                const { tagId } = tag;
                tagId &&
                    (await collection_product_tag.create({
                        collection_id: collectionId,
                        tag_id: tagId,
                    }));
            }
        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Destroy Collection product tag
     */
    deleteCollectionProductTag: async collectionId => {
        try {
            // Delete existing product tags
            await collection_product_tag.destroy({
                where: { id: collectionId },
                truncate: true,
            });
        } catch (error) {
            console.log(error);
        }
    },
};
