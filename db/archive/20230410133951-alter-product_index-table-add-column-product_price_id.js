'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding product_price_id column");

      // Defining whether the product_index table already exist or not.
      const isExist = await queryInterface.tableExists("product_index");

      // Condition for altering the table only if the table is exist.
      if (isExist) {
        // Defining the table
        const productPriceDefinition = await queryInterface.describeTable("product_index");

        // Condition for adding the product_price_id column if it doesn't exist in the table.
        if (productPriceDefinition && !productPriceDefinition["product_price_id"]) {
          await queryInterface.addColumn("product_index", "product_price_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
        
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the product_index table already exist or not.
      const isExist = await queryInterface.tableExists("product_index");

      // Condition for altering the table only if the table is exist.
      if (isExist) {
        // Defining the table
        const productPriceDefinition = await queryInterface.describeTable("product_index");
        
        // Condition for removing the product_price_id column if it's exist in the table.
        if (productPriceDefinition && productPriceDefinition["product_price_id"]) {
          await queryInterface.removeColumn("product_index", "product_price_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

