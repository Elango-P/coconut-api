'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user_device_info table - Adding last_logged_in_at");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_device_info");

      // Condition for adding the last_logged_in_at and last_logged_in_at.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["last_logged_in_at"]) {
        await queryInterface.addColumn("user_device_info", "last_logged_in_at", {
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
      const tableDefinition = await queryInterface.describeTable("user_device_info");

      // Condition for removing the last_logged_in_at and last_logged_in_at column if it's exist in the table
      if (tableDefinition && tableDefinition["last_logged_in_at"]) {
        await queryInterface.removeColumn("user_device_info", "last_logged_in_at");
      }

    
    } catch (err) {
      console.log(err);
    }
  }
};

