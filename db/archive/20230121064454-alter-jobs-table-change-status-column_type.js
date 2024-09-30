'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering jobs table - Changing the status column type BOOLEAN to INTEGER");

      // Defining whether the jobs table already exist or not.
      const jobsTableExists = await queryInterface.tableExists("jobs");

      // Condition for altering the table only if the table is exist.
      if (jobsTableExists) {
        // Defining the table
        const jobsTableDefinition = await queryInterface.describeTable("jobs");

        // Condition for changing the status column only if it exist in the table.
        if (jobsTableDefinition && jobsTableDefinition["status"]) {
          await queryInterface.changeColumn("jobs", "status", { type: 'INTEGER USING CAST("status" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the jobs table already exist or not.
      const jobsTableExists = await queryInterface.tableExists("jobs");

      // Condition for altering the table only if the table is exist.
      if (jobsTableExists) {
        // Defining the table
        const jobsTableDefinition = await queryInterface.describeTable("jobs");

        // Condition for changing the status column type only if it exist in the table.
        if (jobsTableDefinition && jobsTableDefinition["status"]) {
          await queryInterface.changeColumn("jobs", "status", { type: 'BOOLEAN USING CAST("status" as BOOLEAN)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
