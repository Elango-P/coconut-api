"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier_product table - Renaming column vendor_id to supplier_id");
      return queryInterface.describeTable("supplier_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_id"]) {
          return queryInterface.renameColumn("supplier_product", "vendor_id", "supplier_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
