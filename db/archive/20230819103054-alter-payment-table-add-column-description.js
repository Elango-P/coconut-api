'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Adding description column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");
      // Condition for adding the description column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["description"]) {
        await queryInterface.addColumn("payment", "description", {
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
      const tableDefinition = await queryInterface.describeTable("payment");
      // Condition for removing the description column if it's exist in the table
      if (tableDefinition && tableDefinition["description"]) {
        await queryInterface.removeColumn("payment", "description");
      }
    } catch (err) {
      console.log(err);
    }
  }
};