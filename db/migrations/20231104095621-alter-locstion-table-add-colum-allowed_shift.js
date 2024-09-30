'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding allowed_shift column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for adding the allowed_shift column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["allowed_shift"]) {
        await queryInterface.addColumn("store", "allowed_shift", {
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
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for removing the allowed_shift column if it's exist in the table
      if (tableDefinition && tableDefinition["allowed_shift"]) {
        await queryInterface.removeColumn("store", "allowed_shift");
      }
    } catch (err) {
      console.log(err);
    }
  }
};