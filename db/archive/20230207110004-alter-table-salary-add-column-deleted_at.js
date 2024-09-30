'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding deleted_at column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the deleted_at column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["deleted_at"]) {
          await queryInterface.addColumn("salary", "deleted_at", {
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
        
        // Condition for removing the deleted_at column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["deleted_at"]) {
          await queryInterface.removeColumn("salary", "deleted_at");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

