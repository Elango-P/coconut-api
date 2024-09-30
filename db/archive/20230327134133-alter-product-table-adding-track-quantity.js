'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Adding track-quantity column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      // Condition for adding the minimum_cash_in_store column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["track_quantity"]) {
        await queryInterface.addColumn("product", "track_quantity", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("product");
      // Condition for removing the minimum_cash_in_store column if it's exist in the table
      if (tableDefinition && tableDefinition["track_quantity"]) {
        await queryInterface.removeColumn("product", "track_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};