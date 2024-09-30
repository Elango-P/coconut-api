'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding start_date column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the start_date column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["start_date"]) {
          await queryInterface.addColumn("salary", "start_date", {
            type: Sequelize.DATE,
            allowNull: true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");
        
        // Condition for removing the start_date column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["start_date"]) {
          await queryInterface.removeColumn("salary", "start_date");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

