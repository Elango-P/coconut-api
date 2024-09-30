'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Adding amount_cash column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("payment");

      // Condition for adding the amount_cash column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["amount_cash"]) {
        await queryInterface.addColumn("payment", "amount_cash", {
          type : Sequelize.DECIMAL,
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
      
      // Condition for removing the amount_cash column if it's exist in the table
      if (tableDefinition && tableDefinition["amount_cash"]) {
        await queryInterface.removeColumn("payment", "amount_cash");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

