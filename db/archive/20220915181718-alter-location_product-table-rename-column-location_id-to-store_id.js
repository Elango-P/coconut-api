'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering location_product table - Renaming column from location_id to store_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("location_product");

      // Condition for renaming the column from location_id to store_id if store_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["store_id"]) {
        await queryInterface.renameColumn("location_product", "location_id", "store_id");
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
      if (tableDefinition && tableDefinition["store_id"]) {
        await queryInterface.renameColumn("location_product", "store_id", "location_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
