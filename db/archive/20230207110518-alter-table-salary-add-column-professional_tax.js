'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Adding professional_tax column");

      // Defining whether the salary table already exist or not.
      const orderTableExists = await queryInterface.tableExists("salary");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("salary");

        // Condition for adding the professional_tax column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["professional_tax"]) {
          await queryInterface.addColumn("salary", "professional_tax", {
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
        
        // Condition for removing the professional_tax column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["professional_tax"]) {
          await queryInterface.removeColumn("salary", "professional_tax");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

