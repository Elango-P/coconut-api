'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding margin_percentage column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for adding the margin_percentage column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["margin_percentage"]) {
        await queryInterface.addColumn("product_index", "margin_percentage", {
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

      // Condition for removing the margin_percentage column if it's exist in the table
      if (tableDefinition && tableDefinition["margin_percentage"]) {
        await queryInterface.removeColumn("product_index", "margin_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

