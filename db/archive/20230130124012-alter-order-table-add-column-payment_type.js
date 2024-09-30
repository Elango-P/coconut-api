'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order table - Adding payment_type column");

      // Defining whether the order table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("order");

        // Condition for adding the payment_type column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["payment_type"]) {
          await queryInterface.addColumn("order", "payment_type", {
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
      // Defining whether the order table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("order");
        
        // Condition for removing the payment_type column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["payment_type"]) {
          await queryInterface.removeColumn("order", "payment_type");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

