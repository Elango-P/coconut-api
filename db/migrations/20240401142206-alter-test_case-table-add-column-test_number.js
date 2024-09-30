'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering test_case table - Adding test_number");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_case");

      // Condition for adding the test_number and test_number.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["test_number"]) {
        await queryInterface.addColumn("test_case", "test_number", {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_case");

      // Condition for removing the test_number and test_number column if it's exist in the table
      if (tableDefinition && tableDefinition["test_number"]) {
        await queryInterface.removeColumn("test_case", "test_number");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

