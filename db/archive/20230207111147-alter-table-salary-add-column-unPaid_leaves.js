'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding unPaid_leaves column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the unPaid_leaves column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["unPaid_leaves"]) {
          await queryInterface.addColumn("salary", "unPaid_leaves", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for removing the unPaid_leaves column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["unPaid_leaves"]) {
          await queryInterface.removeColumn("salary", "unPaid_leaves");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

