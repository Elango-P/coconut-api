'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding special_allowance column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the special_allowance column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["special_allowance"]) {
          await queryInterface.addColumn("salary", "special_allowance", {
            type: Sequelize.DECIMAL,
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
        
        // Condition for removing the special_allowance column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["special_allowance"]) {
          await queryInterface.removeColumn("salary", "special_allowance");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

