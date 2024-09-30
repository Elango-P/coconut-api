'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering transfer table - Adding owner_id column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("transfer");
      // Condition for adding the owner_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["owner_id"]) {
        await queryInterface.addColumn("transfer", "owner_id", {
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
      const tableDefinition = await queryInterface.describeTable("transfer");
      // Condition for removing the owner_id column if it's exist in the table
      if (tableDefinition && tableDefinition["owner_id"]) {
        await queryInterface.removeColumn("transfer", "owner_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};