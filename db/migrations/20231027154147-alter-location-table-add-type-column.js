'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding type column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for adding the type column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["type"]) {
        await queryInterface.addColumn("store", "type", {
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
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for removing the type column if it's exist in the table
      if (tableDefinition && tableDefinition["type"]) {
        await queryInterface.removeColumn("store", "type");
      }
    } catch (err) {
      console.log(err);
    }
  }
};