'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering salary table - Renaming column from house_rent_allowance to worked_days");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");

      // Condition for renaming the column from house_rent_allowance to worked_days if worked_days column doesn't exist in the table
      if (tableDefinition && !tableDefinition["worked_days"]) {
        await queryInterface.renameColumn("salary", "house_rent_allowance", "worked_days");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("salary");
      
      // Condition for renaming the column from worked_days to house_rent_allowance if worked_days column exist in the table
      if (tableDefinition && tableDefinition["worked_days"]) {
        await queryInterface.renameColumn("salary", "worked_days", "house_rent_allowance");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
