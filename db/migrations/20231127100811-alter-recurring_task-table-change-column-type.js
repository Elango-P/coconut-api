'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering recurring_task table - Changing the month column type BIGINT to INTEGER");
      // Defining whether the recurring_task table already exist or not.
      const recurringTaskTable = await queryInterface.tableExists("recurring_task");
      // Condition for altering the table only if the table is exist.
      if (recurringTaskTable) {
        // Defining the table
        const recurringTaskTableDefinition = await queryInterface.describeTable("recurring_task");
        // Condition for changing the month column only if it exist in the table.
        if (recurringTaskTableDefinition && recurringTaskTableDefinition["month"]) {
          await queryInterface.changeColumn("recurring_task", "month", { type: 'DECIMAL USING CAST("month" as DECIMAL)' });
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
        // Condition for changing the month column type only if it exist in the table.
        if (recurringTaskTableDefinition && recurringTaskTableDefinition["month"]) {
          await queryInterface.changeColumn("recurring_task", "month", { type: 'STRING USING CAST("month" as STRING)' });
        };
     
      };
    } catch (err) {
      console.log(err);
    };
  },
};