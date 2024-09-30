'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering apartment table - Removing portal_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("apartment");

      // Condition for removing the portal_id column if it's exist in the table
      if (tableDefinition && tableDefinition["portal_id"]) {
        await queryInterface.removeColumn("apartment", "portal_id");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("apartment");
      
      // Condition for adding the portal_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["portal_id"]) {
        await queryInterface.addColumn("apartment", "portal_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};
