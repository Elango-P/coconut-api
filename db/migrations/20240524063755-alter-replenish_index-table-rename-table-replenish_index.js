"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Renaming table name from replenish_index to replenishment");

      // Defining the replenish_index table
      const taskTable = await queryInterface.tableExists("replenish_index");

      // Defining the replenishment table
      const ticketTable = await queryInterface.tableExists("replenishment");

      // Condition for renaming the table name from replenish_index to replenishment, only if the replenish_index table is exist and replenishment table does not exist on the database.
      if (taskTable && !ticketTable) {
        await queryInterface.renameTable("replenish_index", "replenishment"); 
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining the replenish_index table
      const taskTable = await queryInterface.tableExists("replenish_index");

      // Defining the replenishment table
      const ticketTable = await queryInterface.tableExists("replenishment");

      // Condition for renaming the table name from replenishment to replenish_index, only if the replenishment table is exist and replenish_index table does not exist on the database.
      if (ticketTable && !taskTable) {
        await queryInterface.renameTable("replenishment", "replenish_index");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
