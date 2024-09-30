'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering app_version table - Changing the app_id column type STRING to INTEGER");

      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("app_version");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("app_version");

        // Condition for changing the status column only if it exist in the table.
        if (userTableDefinition && userTableDefinition["app_id"]) {
          await queryInterface.changeColumn("app_version", "app_id", { type: 'INTEGER USING CAST("app_id" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("app_version");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("app_version");

        // Condition for changing the createdBy column type only if it exist in the table.
        if (userTableDefinition && userTableDefinition["app_id"]) {
          await queryInterface.changeColumn("app_version", "app_id", { type: 'STRING USING CAST("app_id" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
