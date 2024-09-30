'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order_product table - Adding cancelled_at column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order_product");
      // Condition for adding the description column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["cancelled_at"]) {
        await queryInterface.addColumn("order_product", "cancelled_at", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order_product");
      // Condition for removing the description column if it's exist in the table
      if (tableDefinition && tableDefinition["cancelled_at"]) {
        await queryInterface.removeColumn("order_product", "cancelled_at");
      }
    } catch (err) {
      console.log(err);
    }
  }
};