'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sale_settlement table - Adding order_total_amount");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sale_settlement");

      // Condition for adding the order_total_amount and order_total_amount.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["order_total_amount"]) {
        await queryInterface.addColumn("sale_settlement", "order_total_amount", {
          type: Sequelize.DECIMAL,
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
      const tableDefinition = await queryInterface.describeTable("sale_settlement");

      // Condition for removing the order_total_amount and order_total_amount column if it's exist in the table
      if (tableDefinition && tableDefinition["order_total_amount"]) {
        await queryInterface.removeColumn("sale_settlement", "order_total_amount");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};
