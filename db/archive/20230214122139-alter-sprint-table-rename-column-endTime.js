'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sprint table - Renaming column from end_time to end_date");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sprint");

      // Condition for renaming the column from end_time to end_date if end_date column doesn't exist in the table
      if (tableDefinition && !tableDefinition["end_date"]) {
        await queryInterface.renameColumn("sprint", "end_time", "end_date");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sprint");
      
      // Condition for renaming the column from end_time to end_date if end_date column exist in the table
      if (tableDefinition && tableDefinition["end_date"]) {
        await queryInterface.renameColumn("sprint", "end_date", "end_time");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

