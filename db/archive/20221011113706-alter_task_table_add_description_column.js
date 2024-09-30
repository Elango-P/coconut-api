"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Altering task table - Adding description column");

      // Checking the table exists or not.
      const tableExists = await queryInterface.tableExists("task");

      // Condition for altering the table only if the task table is exist.
      if (tableExists) {
        // Defining the table
        const tableDefinition = await queryInterface.describeTable("task");
        
        // Condition for adding the description column if it doesn't exist in the table.
        if (tableDefinition && !tableDefinition["description"]) {
          await queryInterface.addColumn("task", "description", {
            type: Sequelize.TEXT,
            allowNull: true,
          });
        };
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
  
        // Condition for removing the description column if it's exist in the table.
        if (tableDefinition && tableDefinition["description"]) {
          await queryInterface.removeColumn("task", "description");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
