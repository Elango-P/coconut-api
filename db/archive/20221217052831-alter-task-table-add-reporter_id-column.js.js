'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering task table - Adding reporter_id column");

      // Checking the table exists or not.
      const tableExists = await queryInterface.tableExists("task");

      // Condition for altering the table only if the task table is exist.
      if (tableExists) {
        // Defining the table
        const tableDefinition = await queryInterface.describeTable("task");
  
        // Condition for adding the reporter_id column if it doesn't exist in the table
        if (tableDefinition && !tableDefinition["reporter_id"]) {
          await queryInterface.addColumn("task", "reporter_id", {
            type : Sequelize.INTEGER,
            allowNull : true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Checking the table exists or not.
      const tableExists = await queryInterface.tableExists("task");

      // Condition for altering the table only if the task table is exist.
      if (tableExists) {
        // Defining the table
        const tableDefinition = await queryInterface.describeTable("task");

        // Condition for removing the reporter_id column if it's exist in the table.
        if (tableDefinition && tableDefinition["reporter_id"]) {
          await queryInterface.removeColumn("task", "reporter_id");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
