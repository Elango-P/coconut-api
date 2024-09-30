'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering bill table - Adding discrepancy_amount column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for adding the tax_amount column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["tax_amount"]) {
        await queryInterface.addColumn("bill", "tax_amount", {
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
      const tableDefinition = await queryInterface.describeTable("bill");

      // Condition for removing the tax_amount column if it's exist in the table
      if (tableDefinition && tableDefinition["tax_amount"]) {
        await queryInterface.removeColumn("bill", "tax_amount");
      }

    } catch (err) {
      console.log(err);
    }
  }
};

