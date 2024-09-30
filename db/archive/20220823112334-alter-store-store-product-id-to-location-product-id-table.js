"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering location_product table - Renaming column store_product_id to location_product_id");
      return queryInterface.describeTable("location_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["store_product_id"]) {
          return queryInterface.renameColumn("location_product", "store_product_id", "location_product_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
