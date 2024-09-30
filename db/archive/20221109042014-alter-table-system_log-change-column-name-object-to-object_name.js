'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering system_log table - Renaming column from object to object_name");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("system_log");

      // Condition for renaming the column from object to object_name if object_name column doesn't exist in the table
      if (tableDefinition && !tableDefinition["object_name"]) {
        await queryInterface.renameColumn("system_log", "object", "object_name");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("system_log");
      
      // Condition for renaming the column from object to object_name if object_name column exist in the table
      if (tableDefinition && tableDefinition["object_name"]) {
        await queryInterface.renameColumn("system_log", "object_name", "object");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

