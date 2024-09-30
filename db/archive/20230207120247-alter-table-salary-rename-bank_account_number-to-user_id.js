'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from bank_account_number to user_id");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from bank_account_number to user_id if user_id column doesn't exist in the table
      if (tableDefinition && !tableDefinition["user_id"]) {
        await queryInterface.renameColumn("salary", "bank_account_number", "user_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from user_id to bank_account_number if user_id column exist in the table
      if (tableDefinition && tableDefinition["user_id"]) {
        await queryInterface.renameColumn("salary", "user_id", "bank_account_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
