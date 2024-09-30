'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding minimum_cash_in_store column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store");
      // Condition for adding the minimum_cash_in_store column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["minimum_cash_in_store"]) {
        await queryInterface.addColumn("store", "minimum_cash_in_store", {
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
      // Condition for removing the minimum_cash_in_store column if it's exist in the table
      if (tableDefinition && tableDefinition["minimum_cash_in_store"]) {
        await queryInterface.removeColumn("store", "minimum_cash_in_store");
      }
    } catch (err) {
      console.log(err);
    }
  }
};