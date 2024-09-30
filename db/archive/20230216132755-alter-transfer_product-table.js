'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer_product table - Removing unit_price column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["unit_price"]) {
        await queryInterface.removeColumn("transfer_product", "unit_price");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");

      // Condition for adding the unit_price column if it doesn't exist in the table

      if (tableDefinition && !tableDefinition["unit_price"]) {
        await queryInterface.addColumn("transfer_product", "unit_price", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};