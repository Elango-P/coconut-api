'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Adding force_sync column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for adding the description column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["force_sync"]) {
        await queryInterface.addColumn("user", "force_sync", {
          type: Sequelize.BOOLEAN,
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
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for removing the description column if it's exist in the table
      if (tableDefinition && tableDefinition["force_sync"]) {
        await queryInterface.removeColumn("user", "force_sync");
      }
    } catch (err) {
      console.log(err);
    }
  }
};