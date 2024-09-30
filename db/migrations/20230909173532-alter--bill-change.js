'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Changing the status column type STRING to INTEGER");

      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("bill");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("bill");

        // Condition for changing the status column only if it exist in the table.
        if (userTableDefinition && userTableDefinition["invoice_amount"]) {
          await queryInterface.changeColumn("bill", "invoice_amount", { type: 'DECIMAL USING CAST("invoice_amount" as DECIMAL)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the user table already exist or not.
      const userTableExists = await queryInterface.tableExists("bill");

      // Condition for altering the table only if the table is exist.
      if (userTableExists) {
        // Defining the table
        const userTableDefinition = await queryInterface.describeTable("bill");

        // Condition for changing the status column type only if it exist in the table.
        if (userTableDefinition && userTableDefinition["invoice_amount"]) {
          await queryInterface.changeColumn("bill","invoice_amount", { type: 'INTEGER USING CAST("invoice_amount" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};


