'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user_role table - Removing role_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_role");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["role_id"]) {
        await queryInterface.removeColumn("user_role", "role_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_role");
      
      // Condition for adding the role_id column if it doesn't exist in the table
      
      if (tableDefinition && !tableDefinition["role_id"]) {
        await queryInterface.addColumn("user_role", "role_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};