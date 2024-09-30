'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from night_shift_allowance to end_date");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from night_shift_allowance to end_date if end_date column doesn't exist in the table
      if (tableDefinition && !tableDefinition["end_date"]) {
        await queryInterface.renameColumn("salary", "night_shift_allowance", "end_date");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from end_date to night_shift_allowance if end_date column exist in the table
      if (tableDefinition && tableDefinition["end_date"]) {
        await queryInterface.renameColumn("salary", "end_date", "night_shift_allowance");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
