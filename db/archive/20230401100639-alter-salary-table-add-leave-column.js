'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding leave column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the leave column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["leave"]) {
          await queryInterface.addColumn("salary", "leave", {
            type: Sequelize.INTEGER,
            allowNull: true,
          });
        };
        if (orderTableDefinition && !orderTableDefinition["absent"]) {
          await queryInterface.addColumn("salary", "absent", {
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
        
        // Condition for removing the leave column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["leave"]) {
          await queryInterface.removeColumn("salary", "leave");
        };
        if (orderTableDefinition && orderTableDefinition["absent"]) {
          await queryInterface.removeColumn("salary", "absent");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

