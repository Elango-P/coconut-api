'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from travel_allowance to additional_days");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from travel_allowance to additional_days if additional_days column doesn't exist in the table
      if (tableDefinition && !tableDefinition["additional_days"]) {
        await queryInterface.renameColumn("salary", "travel_allowance", "additional_days");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from additional_days to travel_allowance if additional_days column exist in the table
      if (tableDefinition && tableDefinition["additional_days"]) {
        await queryInterface.renameColumn("salary", "additional_days", "travel_allowance");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
