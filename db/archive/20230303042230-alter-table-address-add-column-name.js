'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering address table - Adding name column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("address");
      // Condition for adding the name column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["name"]) {
        await queryInterface.addColumn("address", "name", {
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
      const tableDefinition = await queryInterface.describeTable("address");
      // Condition for removing the name column if it's exist in the table
      if (tableDefinition && tableDefinition["name"]) {
        await queryInterface.removeColumn("address", "name");
      }
    } catch (err) {
      console.log(err);
    }
  }
};