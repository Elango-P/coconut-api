'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product");

      // Condition for renaming the column from tax to tax_percentage if tax_percentage column doesn't exist in the table
      if (tableDefinition && tableDefinition["in_transit_quantity"]) {
        await queryInterface.renameColumn("store_product", "in_transit_quantity", "transferred_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_product");
      
      // Condition for renaming the column from tax_percentage to tax if tax_percentage column exist in the table
      if (tableDefinition && tableDefinition["transferred_quantity"]) {
        await queryInterface.renameColumn("store_product", "transferred_quantity", "in_transit_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
