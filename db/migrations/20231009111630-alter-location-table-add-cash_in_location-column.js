'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding cash_in_location column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for adding the cash_in_location column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["cash_in_location"]) {
        await queryInterface.addColumn("store", "cash_in_location", {
          type: Sequelize.DECIMAL,
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
      // Condition for removing the cash_in_location column if it's exist in the table
      if (tableDefinition && tableDefinition["cash_in_location"]) {
        await queryInterface.removeColumn("store", "cash_in_location");
      }
    } catch (err) {
      console.log(err);
    }
  }
};