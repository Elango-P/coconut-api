'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Changing the status column type STRING to INTEGER");

      // Defining whether the bill table already exist or not.
      const paymentTableExists = await queryInterface.tableExists("payment");

      // Condition for altering the table only if the table is exist.
      if (paymentTableExists) {
        // Defining the table
        const paymentTableDefinition = await queryInterface.describeTable("payment");

        // Condition for changing the status column only if it exist in the table.
        if (paymentTableDefinition && paymentTableDefinition["status"]) {
          await queryInterface.changeColumn("payment", "status", { type: 'INTEGER USING CAST("status" as INTEGER)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the payment table already exist or not.
      const paymentTableExists = await queryInterface.tableExists("payment");

      // Condition for altering the table only if the table is exist.
      if (paymentTableExists) {
        // Defining the table
        const paymentTableDefinition = await queryInterface.describeTable("payment");

        // Condition for changing the status column type only if it exist in the table.
        if (paymentTableDefinition && paymentTableDefinition["status"]) {
          await queryInterface.changeColumn("payment", "status", { type: 'STRING USING CAST("status" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
