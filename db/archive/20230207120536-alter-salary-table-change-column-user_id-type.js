'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Changing the user_id column type STRING to INTEGER");

      // Defining whether the salary table already exist or not.
      const userTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("salary");

        // Condition for changing the user_id column only if it exist in the table.
        if (userTableDefinition && userTableDefinition["user_id"]) {
          await queryInterface.changeColumn("salary", "user_id", { type: 'INTEGER USING CAST("user_id" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the salary table already exist or not.
      const userTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("salary");

        // Condition for changing the user_id column type only if it exist in the table.
        if (userTableDefinition && userTableDefinition["user_id"]) {
          await queryInterface.changeColumn("salary", "user_id", { type: 'STRING USING CAST("user_id" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
