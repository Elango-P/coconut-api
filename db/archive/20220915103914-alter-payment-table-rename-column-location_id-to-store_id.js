'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Renaming column from location_id to store_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");

      // Condition for renaming the column from location_id to store_id if store_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["store_id"]) {
        await queryInterface.renameColumn("payment", "location_id", "store_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");
      
      // Condition for renaming the column from store_id to location_id if store_id column exist in the table
      if (tableDefinition && tableDefinition["store_id"]) {
        await queryInterface.renameColumn("payment", "store_id", "location_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
