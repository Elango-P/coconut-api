'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering scheduler_job table - Renaming column from last_executed_at to completed_at");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      // Condition for renaming the column from last_executed_at to completed_at if completed_at column doesn't exist in the table
      if (tableDefinition && !tableDefinition["completed_at"]) {
        await queryInterface.renameColumn("scheduler_job", "last_executed_at", "completed_at");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");
      
      // Condition for renaming the column from last_executed_at to completed_at if last_executed_at column exist in the table
      if (tableDefinition && tableDefinition["completed_at"]) {
        await queryInterface.renameColumn("scheduler_job", "completed_at", "last_executed_at");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

