'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log

      // Defining whether the store_product table already exist or not.
      const orderTableExists = await queryInterface.tableExists("store_product");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("store_product");

        // Condition for adding the last_order_date column if it doesn't exist in the table.
        if (orderTableDefinition && !orderTableDefinition["last_order_date"]) {
          await queryInterface.addColumn("store_product", "last_order_date", {
            type: Sequelize.DATE,
            allowNull: true,
          });
        };
        if (orderTableDefinition && !orderTableDefinition["last_stock_entry_date"]) {
          await queryInterface.addColumn("store_product", "last_stock_entry_date", {
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
      // Defining whether the store_product table already exist or not.
      const orderTableExists = await queryInterface.tableExists("store_product");

      // Condition for altering the table only if the table is exist.
      if (orderTableExists) {
        // Defining the table
        const orderTableDefinition = await queryInterface.describeTable("store_product");
        
        // Condition for removing the last_order_date column if it's exist in the table.
        if (orderTableDefinition && orderTableDefinition["last_order_date"]) {
          await queryInterface.removeColumn("store_product", "last_order_date");
        };
        if (orderTableDefinition && orderTableDefinition["last_stock_entry_date"]) {
          await queryInterface.removeColumn("store_product", "last_stock_entry_date");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};

