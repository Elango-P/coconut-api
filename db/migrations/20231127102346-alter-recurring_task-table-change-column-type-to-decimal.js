'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering recurring_task table - Changing the date column type BIGINT to INTEGER");
      // Defining whether the recurring_task table already exist or not.
      const recurringTaskTable = await queryInterface.tableExists("recurring_task");
      // Condition for altering the table only if the table is exist.
      if (recurringTaskTable) {
        // Defining the table
        const recurringTaskTableDefinition = await queryInterface.describeTable("recurring_task");
        // Condition for changing the date column only if it exist in the table.
        if (recurringTaskTableDefinition && recurringTaskTableDefinition["date"]) {
          await queryInterface.changeColumn("recurring_task", "date", { type: 'DECIMAL USING CAST("date" as DECIMAL)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the recurring_task table already exist or not.
      const recurringTaskTable = await queryInterface.tableExists("recurring_task");
      // Condition for altering the table only if the table is exist.
      if (recurringTaskTable) {
        // Defining the table
        const recurringTaskTableDefinition = await queryInterface.describeTable("recurring_task");
        // Condition for changing the date column type only if it exist in the table.
        if (recurringTaskTableDefinition && recurringTaskTableDefinition["date"]) {
          await queryInterface.changeColumn("recurring_task", "date", { type: 'STRING USING CAST("date" as STRING)' });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};