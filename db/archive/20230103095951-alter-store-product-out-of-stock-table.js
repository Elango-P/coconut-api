'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store product out of stock product table - Adding company id column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product_out_of_stock");
      // Condition for adding the bill_number column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["company_id"]) {
        await queryInterface.addColumn("store_product_out_of_stock", "company_id", {
          type : Sequelize.INTEGER,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product_out_of_stock");
      // Condition for removing the company id column if it's exist in the table
      if (tableDefinition && tableDefinition["company_id"]) {
        await queryInterface.removeColumn("store_product_out_of_stock", "company_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};