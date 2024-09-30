'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sprint table - Renaming column from start_time to start_date");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sprint");

      // Condition for renaming the column from start_time to start_date if start_date column doesn't exist in the table
      if (tableDefinition && !tableDefinition["start_date"]) {
        await queryInterface.renameColumn("sprint", "start_time", "start_date");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sprint");
      
      // Condition for renaming the column from start_time to start_date if start_date column exist in the table
      if (tableDefinition && tableDefinition["start_date"]) {
        await queryInterface.renameColumn("sprint", "start_date", "start_time");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

