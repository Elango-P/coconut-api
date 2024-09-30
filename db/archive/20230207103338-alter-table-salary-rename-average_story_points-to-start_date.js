'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from average_story_points to start_date");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from average_story_points to start_date if start_date column doesn't exist in the table
      if (tableDefinition && !tableDefinition["start_date"]) {
        await queryInterface.renameColumn("salary", "average_story_points", "start_date");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from start_date to average_story_points if start_date column exist in the table
      if (tableDefinition && tableDefinition["start_date"]) {
        await queryInterface.renameColumn("salary", "start_date", "average_story_points");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
