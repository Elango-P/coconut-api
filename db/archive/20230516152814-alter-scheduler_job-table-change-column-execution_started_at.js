'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering scheduler_job table - Renaming column from execution_started_at to started_at");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      // Condition for renaming the column from execution_started_at to started_at if started_at column doesn't exist in the table
      if (tableDefinition && !tableDefinition["started_at"]) {
        await queryInterface.renameColumn("scheduler_job", "execution_started_at", "started_at");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("scheduler_job");
      
      // Condition for renaming the column from execution_started_at to started_at if execution_started_at column exist in the table
      if (tableDefinition && tableDefinition["started_at"]) {
        await queryInterface.renameColumn("scheduler_job", "started_at", "execution_started_at");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

