"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering scheduler_job table - Renaming column name to job_name");
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      // Check if the job_name column already exists
      if (tableDefinition && tableDefinition["job_name"]) {
        console.log("Column job_name already exists. Skipping rename.");
        return Promise.resolve(true);
      }

      // Proceed with renaming if job_name does not exist
      return queryInterface.renameColumn("scheduler_job", "name", "job_name");
    } catch (err) {
      console.log(err);
    }
  },
};
