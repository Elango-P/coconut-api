'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering bill table - Renaming column from created_by to owner_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for renaming the column from vendor_id to account_id if account_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["account_id"]) {
        await queryInterface.renameColumn("bill", "vendor_id", "account_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");
      
      // Condition for renaming the column from created_by to owner_id if created_by column exist in the table
      if (tableDefinition && tableDefinition["vendor_id"]) {
        await queryInterface.renameColumn("bill", "account_id", "vendor_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

