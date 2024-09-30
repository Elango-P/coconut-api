'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user_index table - Adding last_checkin_at column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_index");
      // Condition for adding the description column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["last_checkin_at"]) {
        await queryInterface.addColumn("user_index", "last_checkin_at", {
          type: Sequelize.DATE,
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
      const tableDefinition = await queryInterface.describeTable("user_index");
      // Condition for removing the description column if it's exist in the table
      if (tableDefinition && tableDefinition["last_checkin_at"]) {
        await queryInterface.removeColumn("user_index", "last_checkin_at");
      }
    } catch (err) {
      console.log(err);
    }
  }
};