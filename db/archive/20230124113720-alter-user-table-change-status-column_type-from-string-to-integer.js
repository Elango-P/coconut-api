'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Changing the status column type STRING to INTEGER");

      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("user");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("user");

        // Condition for changing the status column only if it exist in the table.
        if (userTableDefinition && userTableDefinition["status"]) {
          await queryInterface.changeColumn("user", "status", { type: 'INTEGER USING CAST("status" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("user");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("user");

        // Condition for changing the status column type only if it exist in the table.
        if (userTableDefinition && userTableDefinition["status"]) {
          await queryInterface.changeColumn("user", "status", { type: 'STRING USING CAST("status" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
