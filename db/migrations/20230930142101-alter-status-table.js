'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("status");

      // Condition for renaming the column from tax to tax_percentage if tax_percentage column doesn't exist in the table
      if (tableDefinition && tableDefinition["update_in_transit_quantity"]) {
        await queryInterface.renameColumn("status", "update_in_transit_quantity", "update_transferred_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("status");
      
      // Condition for renaming the column from tax_percentage to tax if tax_percentage column exist in the table
      if (tableDefinition && tableDefinition["update_transferred_quantity"]) {
        await queryInterface.renameColumn("status", "update_transferred_quantity", "update_in_transit_quantity");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
