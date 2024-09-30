'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering address table - Adding title column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("address");
      // Condition for adding the title column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["title"]) {
        await queryInterface.addColumn("address", "title", {
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
      // Condition for removing the title column if it's exist in the table
      if (tableDefinition && tableDefinition["title"]) {
        await queryInterface.removeColumn("address", "title");
      }
    } catch (err) {
      console.log(err);
    }
  }
};