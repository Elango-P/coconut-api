'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding bill_id column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for adding the bill_id column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["bill_id"]) {
        await queryInterface.addColumn("purchase", "bill_id", {
          type : Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("purchase");
      
      // Condition for removing the bill_id column if it's exist in the table
      if (tableDefinition && tableDefinition["bill_id"]) {
        await queryInterface.removeColumn("purchase", "bill_id");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

