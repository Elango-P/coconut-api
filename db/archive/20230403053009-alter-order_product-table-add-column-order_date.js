'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order_product table - Adding order_date column");

      // Defining whether the order_product table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order_product");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("order_product");

        // Condition for adding the order_date column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["order_date"]) {
          await queryInterface.addColumn("order_product", "order_date", {
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
      // Defining whether the order_product table already exist or not.
      const orderTableExists = await queryInterface.tableExists("order_product");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("order_product");
        
        // Condition for removing the order_date column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["order_date"]) {
          await queryInterface.removeColumn("order_product", "order_date");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

