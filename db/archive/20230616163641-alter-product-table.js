'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Renaming column from created_by to owner_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for renaming the column from manufacture to manufacture_id if manufacture_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["manufacture_id"]) {
        await queryInterface.renameColumn("product", "manufacture", "manufacture_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");
      
      // Condition for renaming the column from created_by to owner_id if created_by column exist in the table
      if (tableDefinition && tableDefinition["manufacture"]) {
        await queryInterface.renameColumn("product", "manufacture_id", "manufacture");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

