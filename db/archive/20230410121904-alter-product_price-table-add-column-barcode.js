'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_price table - Adding barcode column");

      // Defining whether the product_price table already exist or not.
      const isExist = await queryInterface.tableExists("product_price");

      // Condition for altering the table only if the table is exist.
      if (isExist) {
        // Defining the table
        const productPriceDefinition = await queryInterface.describeTable("product_price");

        // Condition for adding the barcode column if it doesn't exist in the table.
        if (productPriceDefinition && !productPriceDefinition["barcode"]) {
          await queryInterface.addColumn("product_price", "barcode", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
        if (productPriceDefinition && !productPriceDefinition["cost_price"]) {
          await queryInterface.addColumn("product_price", "cost_price", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };

        if (productPriceDefinition && productPriceDefinition["price"]) {
          return queryInterface.renameColumn(
              "product_price",
              "price",
              "mrp"
          );
      }
        
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the product_price table already exist or not.
      const isExist = await queryInterface.tableExists("product_price");

      // Condition for altering the table only if the table is exist.
      if (isExist) {
        // Defining the table
        const productPriceDefinition = await queryInterface.describeTable("product_price");
        
        // Condition for removing the barcode column if it's exist in the table.
        if (productPriceDefinition && productPriceDefinition["barcode"]) {
          await queryInterface.removeColumn("product_price", "barcode");
        };
        if (productPriceDefinition && !productPriceDefinition["cost_price"]) {
          await queryInterface.removeColumn("product_price", "cost_price", {
          });
        };
        if (productPriceDefinition && productPriceDefinition["price"]) {
          return queryInterface.removeColumn(
              "product_price",
              "price"
          );
      }
        
      };
    } catch (err) {
      console.log(err);
    };
  },
};

