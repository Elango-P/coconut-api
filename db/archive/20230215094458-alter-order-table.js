'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order table - Changing the status column type STRING to INTEGER");

      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("order");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("order");

        // Condition for changing the status column only if it exist in the table.
        if (userTableDefinition && userTableDefinition["createdBy"]) {
          await queryInterface.changeColumn("order", "createdBy", { type: 'INTEGER USING CAST("createdBy" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) { 
    try {
      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("order");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("order");

        // Condition for changing the createdBy column type only if it exist in the table.
        if (userTableDefinition && userTableDefinition["createdBy"]) {
          await queryInterface.changeColumn("order", "createdBy", { type: 'STRING USING CAST("createdBy" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
