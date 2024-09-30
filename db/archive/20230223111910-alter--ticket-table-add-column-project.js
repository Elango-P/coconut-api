'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket   table - Adding project column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket");
      // Condition for adding the owner_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["project_id"]) {
        await queryInterface.addColumn("ticket", "project_id", {
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
      const tableDefinition = await queryInterface.describeTable("ticket");
      // Condition for removing the owner_id column if it's exist in the table
      if (tableDefinition && tableDefinition["project_id"]) {
        await queryInterface.removeColumn("ticket", "project_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
