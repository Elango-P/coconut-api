'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding margin_amount column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for adding the margin_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["margin_amount"]) {
        await queryInterface.addColumn("product_index", "margin_amount", {
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
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for removing the margin_amount column if it's exist in the table
      if (tableDefinition && tableDefinition["margin_amount"]) {
        await queryInterface.removeColumn("product_index", "margin_amount");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

