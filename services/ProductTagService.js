/**
 * Module dependencies
 */

const async = require("async");

const {  productTag } = require("../db").models;

module.exports = {
    /**
     * Bulk Create Product Tag
     */
    bulkCreate: async (productIds, tag_id, company_id,callBack) => {

try{
    if(productIds && productIds.length > 0){
        for(let i=0;i<productIds.length;i++){

            let productId = productIds[i]

            // Get Product Tag Exists
            const productTagExists = await productTag.findOne({
                where: { product_id:productId, tag_id:tag_id,company_id:company_id },
            });

            // Get Product Tag
            if (productTagExists) {
            const productTagData = { product_id:productId, tag_id:tag_id};
                await productTag.update(productTagData, { where: { product_id: productId, company_id:company_id , tag_id:tag_id} });

            }else{
            const productTagData = { product_id:productId, tag_id:tag_id, company_id:company_id};
                await productTag.create(productTagData).then(() => callBack());
            }
        }
    }
    }catch(err){
      console.log(err);  
    }
                
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
