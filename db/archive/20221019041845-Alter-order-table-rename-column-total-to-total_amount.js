'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order table - Renaming column from total to total_amount");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order");

      // Condition for renaming the column from total to total_amount if total_amount column doesn't exist in the table
      if (tableDefinition && !tableDefinition["total_amount"]) {
        await queryInterface.renameColumn("order", "total", "total_amount");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order");
      
      // Condition for renaming the column from total to total_amount if total_amount column exist in the table
      if (tableDefinition && tableDefinition["total_amount"]) {
        await queryInterface.renameColumn("order", "total_amount", "total");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

