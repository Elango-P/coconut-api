'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering visitor table - Changing the column name from 'purpose' to 'category'");

      // Check if the 'purpose' column exists in the 'visitor' table
      const tableDefinition = await queryInterface.describeTable("visitor");

      if (tableDefinition && tableDefinition["purpose"]) {
        // Rename the 'purpose' column to 'category'
        await queryInterface.renameColumn("visitor", "purpose", "category");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Reverting visitor table - Changing the column name from 'category' to 'purpose'");

      // Check if the 'category' column exists in the 'visitor' table
      const tableDefinition = await queryInterface.describeTable("visitor");

      if (tableDefinition && tableDefinition["category"]) {
        // Rename the 'category' column back to 'purpose'
        await queryInterface.renameColumn("visitor", "category", "purpose");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
