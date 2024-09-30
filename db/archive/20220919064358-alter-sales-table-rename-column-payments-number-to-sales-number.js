'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sales table - Renaming column from payment_number to sale_number");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for renaming the column from location_id to store_id if store_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["sale_number"]) {
        await queryInterface.renameColumn("sales", "payment_number", "sale_number");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("location_product");
      
      // Condition for renaming the column from store_id to location_id if store_id column exist in the table
      if (tableDefinition && tableDefinition["payment_number"]) {
        await queryInterface.renameColumn("sales", "sale_number", "payment_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

