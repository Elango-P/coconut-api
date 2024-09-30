"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier_product_image table - Renaming column vendor_product_id to supplier_product_id");
      return queryInterface.describeTable("supplier_product_image").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_product_id"]) {
          return queryInterface.renameColumn("supplier_product_image", "vendor_product_id", "supplier_product_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
