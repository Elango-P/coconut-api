'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product_index table - Adding tax_percentage column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");
      // Condition for adding the tax_percentage column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["tax_percentage"]) {
        await queryInterface.addColumn("product_index", "tax_percentage", {
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
      // Condition for removing the tax_percentage column if it's exist in the table
      if (tableDefinition && tableDefinition["tax_percentage"]) {
        await queryInterface.removeColumn("product_index", "tax_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};