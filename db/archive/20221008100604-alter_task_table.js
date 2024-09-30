"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Altering task table - Adding eta column");

      // Checking the table exists or not.
      const tableExists = await queryInterface.tableExists("task");
      
      // Condition for altering the table only if the task table is exist.
      if (tableExists) {
        // Defining the table
        const tableDefinition = await queryInterface.describeTable("task");
        
        // Condition for adding the eta column if it doesn't exist in the table.
        if (tableDefinition && !tableDefinition["eta"]) {
          await queryInterface.addColumn("task", "eta", {
            type: Sequelize.DATE,
            allowNull: true,
          });
        }
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Checking the table exists or not.
      const tableExists = await queryInterface.tableExists("task");

      // Condition for altering the table only if the task table is exist.
      if (tableExists) {
        // Defining the table
        const tableDefinition = await queryInterface.describeTable("task");

        // Condition for removing the eta column if it's exist in the table.
        if (tableDefinition && tableDefinition["eta"]) {
          await queryInterface.removeColumn("task", "eta");
        }
      };
    } catch (err) {
      console.log(err);
    };
  },
};
