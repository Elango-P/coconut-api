'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering stock_entry_product table - Renaming column from created_by to owner_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      // Condition for renaming the column from created_by to owner_id if owner_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["owner_id"]) {
        await queryInterface.renameColumn("stock_entry_product", "created_by", "owner_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");
      
      // Condition for renaming the column from created_by to owner_id if created_by column exist in the table
      if (tableDefinition && tableDefinition["owner_id"]) {
        await queryInterface.renameColumn("stock_entry_product", "owner_id", "created_by");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

