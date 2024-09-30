'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Adding status column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");

      // Condition for adding the status column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["status"]) {
        await queryInterface.addColumn("payment", "status", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");
      
      // Condition for removing the status column if it's exist in the table
      if (tableDefinition && tableDefinition["status"]) {
        await queryInterface.removeColumn("payment", "status");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
