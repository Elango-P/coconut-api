const { productBrand } = require("../db").models;


class BrandService{

    static async getBrandDetailsById(id,company_id){
        const productBrandDetails = await productBrand.findOne({ where: { id, company_id } });
        return productBrandDetails && productBrandDetails;

    }
}

module.exports=BrandService