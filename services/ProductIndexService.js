const DataBaseService = require("../lib/dataBaseService");
const { productIndex } = require("../db").models;
const productIndexModel = new DataBaseService(productIndex);



class ProductIndexService {

    static async updateCategoryName(companyId, categoryId, categoryName) {
        try{
        await productIndexModel.update({ category_name: categoryName }, { where: { category_id: categoryId, company_id: companyId } });
        }catch(err){
            console.log(err);
        }
    }


}

module.exports = ProductIndexService;