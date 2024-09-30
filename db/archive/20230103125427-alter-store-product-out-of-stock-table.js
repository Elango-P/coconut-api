'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store product out of stock product table - change date column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product_out_of_stock");
      // Condition for adding the bill_number column if it doesn't exist in the table
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("store_product_out_of_stock", "date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
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
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("store_product_out_of_stock", "date", {
          type: Sequelize.DATE,
          allowNull: true,
      });      }
    } catch (err) {
      console.log(err);
    }
  }
};