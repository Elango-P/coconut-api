'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer_product table - Renaming column from inventory_transfer_id to transfer_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");

      // Condition for renaming the column from inventory_transfer_id to transfer_id if transfer_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["transfer_id"]) {
        await queryInterface.renameColumn("transfer_product", "inventory_transfer_id", "transfer_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer_product");
      
      // Condition for renaming the column from transfer_id to inventory_transfer_id if transfer_id column exist in the table
      if (tableDefinition && tableDefinition["transfer_id"]) {
        await queryInterface.renameColumn("transfer_product", "transfer_id", "inventory_transfer_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
