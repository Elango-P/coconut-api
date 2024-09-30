'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Renaming column from price to mrp");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for renaming the column from price to mrp if mrp column doesn't exist in the table
      if (tableDefinition && !tableDefinition["mrp"]) {
        await queryInterface.renameColumn("product", "price", "mrp");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      
      // Condition for renaming the column from price to mrp if price column exist in the table
      if (tableDefinition && tableDefinition["mrp"]) {
        await queryInterface.renameColumn("product", "mrp", "price");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

