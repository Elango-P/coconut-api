'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sales table - Adding calculated_amount_cash column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for adding the calculated_amount_cash column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["calculated_amount_cash"]) {
        await queryInterface.addColumn("sales", "calculated_amount_cash", {
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
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for removing the calculated_amount_cash column if it's exist in the table
      if (tableDefinition && tableDefinition["calculated_amount_cash"]) {
        await queryInterface.removeColumn("sales", "calculated_amount_cash");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

