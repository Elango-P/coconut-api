'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering test_platforms table - Removing portal_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_platforms");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["portal_id"]) {
        await queryInterface.removeColumn("test_platforms", "portal_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("test_platforms");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["portal_id"]) {
        await queryInterface.addColumn("test_platforms", "portal_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};