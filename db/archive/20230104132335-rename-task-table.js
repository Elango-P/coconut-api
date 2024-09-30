"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Renaming table name from task to ticket");

      // Defining the task table
      const taskTable = await queryInterface.tableExists("task");

      // Defining the ticket table
      const ticketTable = await queryInterface.tableExists("ticket");

      // Condition for renaming the table name from task to ticket, only if the task table is exist and ticket table does not exist on the database.
      if (taskTable && !ticketTable) {
        await queryInterface.renameTable("task", "ticket"); 
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining the task table
      const taskTable = await queryInterface.tableExists("task");

      // Defining the ticket table
      const ticketTable = await queryInterface.tableExists("ticket");

      // Condition for renaming the table name from ticket to task, only if the ticket table is exist and task table does not exist on the database.
      if (ticketTable && !taskTable) {
        await queryInterface.renameTable("ticket", "task");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
