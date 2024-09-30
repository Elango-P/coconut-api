"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Altering purchase_product table - Renaming column name from product_id to store_product_id");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for renaming the column name from product_id to store_product_id, only if store_product_id column does not exist in the table.
      if (tableDefinition && tableDefinition["product_id"] && !tableDefinition["store_product_id"]) {
        return queryInterface.renameColumn(
          "purchase_product",
          "product_id",
          "store_product_id"
        );
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for renaming the column name from store_product_id to product_id, only if product_id column does not exist in the table.
      if (tableDefinition && tableDefinition["store_product_id"] && !tableDefinition["product_id"]) {
        return queryInterface.renameColumn("purchase_product", "store_product_id", "product_id");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
