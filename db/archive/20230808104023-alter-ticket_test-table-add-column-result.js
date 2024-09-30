'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket_test table - Adding result column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket_test");

      // Condition for adding the result column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["result"]) {
        await queryInterface.addColumn("ticket_test", "result", {
          type : Sequelize.INTEGER,
          allowNull : true,
        });
      }
      if (tableDefinition && !tableDefinition["test_number"]) {
        await queryInterface.addColumn("ticket_test", "test_number", {
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
      const tableDefinition = await queryInterface.describeTable("ticket_test");
      
      // Condition for removing the result column if it's exist in the table
      if (tableDefinition && tableDefinition["result"]) {
        await queryInterface.removeColumn("ticket_test", "result");
      }
      if (tableDefinition && tableDefinition["test_number"]) {
        await queryInterface.removeColumn("ticket_test", "test_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
