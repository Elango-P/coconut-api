'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account table - Renaming column from created_by to owner_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account");

      // Condition for renaming the column from vendor_id to id if id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["id"]) {
        await queryInterface.renameColumn("account", "vendor_id", "id");
      }
      // Condition for renaming the column from vendor_id to id if id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["name"]) {
        await queryInterface.renameColumn("account", "vendor_name", "name");
      }

      if (tableDefinition && !tableDefinition["url"]) {
        await queryInterface.renameColumn("account", "vendor_url", "url");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account");
      
      // Condition for renaming the column from created_by to owner_id if created_by column exist in the table
      if (tableDefinition && tableDefinition["vendor_id"]) {
        await queryInterface.renameColumn("account", "id", "vendor_id");
      }
       // Condition for renaming the column from created_by to owner_id if created_by column exist in the table
       if (tableDefinition && tableDefinition["vendor_name"]) {
        await queryInterface.renameColumn("account", "name", "vendor_name");
      }
      if (tableDefinition && tableDefinition["vendor_url"]) {
        await queryInterface.renameColumn("account", "url", "vendor_url");
      }

    } catch (err) {
      console.log(err);
    }
  }
};

