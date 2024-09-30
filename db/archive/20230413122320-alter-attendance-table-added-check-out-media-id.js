"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log(
        "Altering attendance table - Adding check_out_media_id column"
      );
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("attendance");
      // Condition for adding the check_out_media_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["check_out_media_id"]) {
        await queryInterface.addColumn("attendance", "check_out_media_id", {
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
      const tableDefinition = await queryInterface.describeTable("attendance");
      // Condition for removing the check_out_media_id column if it's exist in the table
      if (tableDefinition && tableDefinition["check_out_media_id"]) {
        await queryInterface.removeColumn("attendance", "check_out_media_id");
      }
    } catch (err) {
      console.log(err);
    }
  },
};