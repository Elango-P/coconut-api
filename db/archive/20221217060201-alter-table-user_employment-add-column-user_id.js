'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user_employment table - Adding user_id column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_employment");

      // Condition for adding the user_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["user_id"]) {
        await queryInterface.addColumn("user_employment", "user_id", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("user_employment");

      // Condition for removing the user_id column if it's exist in the table
      if (tableDefinition && tableDefinition["user_id"]) {
        await queryInterface.removeColumn("user_employment", "user_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

 