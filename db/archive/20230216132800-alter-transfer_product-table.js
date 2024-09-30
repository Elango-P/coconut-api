'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer_product table - Removing amount column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["amount"]) {
        await queryInterface.removeColumn("transfer_product", "amount");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");

      // Condition for adding the amount column if it doesn't exist in the table

      if (tableDefinition && !tableDefinition["amount"]) {
        await queryInterface.addColumn("transfer_product", "amount", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};