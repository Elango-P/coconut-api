'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding salary_number column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the salary_number column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["salary_number"]) {
          await queryInterface.addColumn("salary", "salary_number", {
            type: Sequelize.INTEGER,
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
        
        // Condition for removing the salary_number column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["salary_number"]) {
          await queryInterface.removeColumn("salary", "salary_number");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

