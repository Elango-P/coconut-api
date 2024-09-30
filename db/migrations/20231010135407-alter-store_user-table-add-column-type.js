'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store_user table - Adding type column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store_user");
      // Condition for adding the type column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["type"]) {
        await queryInterface.addColumn("store_user", "type", {
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
      const tableDefinition = await queryInterface.describeTable("store_user");
      // Condition for removing the type column if it's exist in the table
      if (tableDefinition && tableDefinition["type"]) {
        await queryInterface.removeColumn("store_user", "type");
      }
    } catch (err) {
      console.log(err);
    }
  }
};