'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from lunch_allowance to working_days");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from lunch_allowance to working_days if working_days column doesn't exist in the table
      if (tableDefinition && !tableDefinition["working_days"]) {
        await queryInterface.renameColumn("salary", "lunch_allowance", "working_days");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from working_days to lunch_allowance if working_days column exist in the table
      if (tableDefinition && tableDefinition["working_days"]) {
        await queryInterface.renameColumn("salary", "working_days", "lunch_allowance");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
