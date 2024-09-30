const db = require('../db');
const Status = require("../helpers/Status");
const DataBaseService = require('../lib/dataBaseService');

const {  Location, storeProduct } = require('../db').models;

const storeProductModel = new DataBaseService(storeProduct);

class LocationProductAddMissingProducts {
  static async update(company_id) {
    let locationList = await Location.findAll({
      where: {
        company_id: company_id,
        status: Status.ACTIVE_TEXT
      },
    });
    // Loop Location List
    if (locationList && locationList.length > 0) {
      for (let i = 0; i < locationList.length; i++) {
        let { id } = locationList[i];

        let query = `SELECT product_index.product_id
    FROM product_index
    WHERE NOT EXISTS (
        SELECT 1
        FROM store_product
        WHERE store_product.product_id = product_index.product_id
        AND store_product.store_id = ${id} AND company_id = ${company_id}
    );`;

        let queryData = await db.connection.query(query);
        let productList = queryData[1]?.rows;

        if(productList && productList.length > 0){
        for (let i = 0; i < productList.length; i++) {
          let { product_id } = productList[i];

          let createData = {
            product_id: product_id,
            store_id: id,
            company_id: company_id,
          };

          await storeProductModel.create(createData);
        }
      }
      }
    }
  }
}
module.exports = LocationProductAddMissingProducts;
