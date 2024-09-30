'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase_product table - Adding cost_price column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for adding the cost_price column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["cost_price"]) {
        await queryInterface.addColumn("purchase_product", "cost_price", {
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
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for removing the cost_price column if it's exist in the table
      if (tableDefinition && tableDefinition["cost_price"]) {
        await queryInterface.removeColumn("purchase_product", "cost_price");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
