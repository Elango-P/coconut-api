"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sale_product table - Adding amount column");

      // Defining whether the sale_product table already exist or not.
      const saleProductTableExists = await queryInterface.tableExists("sale_product");

      // Condition for altering the table only if the table is exist.
      if (saleProductTableExists) {
        // Defining the table
        const saleProductTableDefinition = await queryInterface.describeTable("sale_product");

        // Condition for adding the amount column if it doesn't exist in the table.
        if (saleProductTableDefinition && !saleProductTableDefinition["amount"]) {
          await queryInterface.addColumn("sale_product", "amount", {
            type: Sequelize.NUMERIC,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the sale_product table already exist or not.
      const saleProductTableExists = await queryInterface.tableExists("sale_product");

      // Condition for altering the table only if the table is exist.
      if (saleProductTableExists) {
        // Defining the table
        const saleProductTableDefinition = await queryInterface.describeTable("sale_product");
        
        // Condition for removing the amount column if it's exist in the table.
        if (saleProductTableDefinition && saleProductTableDefinition["amount"]) {
          await queryInterface.removeColumn("sale_product", "amount");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
