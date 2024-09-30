'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding track-quantity column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      // Condition for adding the minimum_cash_in_store column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["track_quantity"]) {
        await queryInterface.addColumn("product_index", "track_quantity", {
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
      const tableDefinition = await queryInterface.describeTable("product_index");
      // Condition for removing the minimum_cash_in_store column if it's exist in the table
      if (tableDefinition && tableDefinition["tracking_quantity"]) {
        await queryInterface.removeColumn("product_index", "track_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};