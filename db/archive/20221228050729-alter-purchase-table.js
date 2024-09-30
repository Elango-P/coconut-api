'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding bill_number column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");
      // Condition for adding the bill_number column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["bill_number"]) {
        await queryInterface.addColumn("purchase", "bill_number", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");
      // Condition for removing the bill_number column if it's exist in the table
      if (tableDefinition && tableDefinition["bill_number"]) {
        await queryInterface.removeColumn("purchase", "bill_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};