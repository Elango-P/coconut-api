'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from login_time to gratuity");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from login_time to gratuity if gratuity column doesn't exist in the table
      if (tableDefinition && !tableDefinition["gratuity"]) {
        await queryInterface.renameColumn("salary", "login_time", "gratuity");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from gratuity to login_time if gratuity column exist in the table
      if (tableDefinition && tableDefinition["gratuity"]) {
        await queryInterface.renameColumn("salary", "gratuity", "login_time");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
