'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sales table - Adding calculated_amount_upi column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for adding the calculated_amount_upi column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["calculated_amount_upi"]) {
        await queryInterface.addColumn("sales", "calculated_amount_upi", {
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

      // Condition for removing the calculated_amount_upi column if it's exist in the table
      if (tableDefinition && tableDefinition["calculated_amount_upi"]) {
        await queryInterface.removeColumn("sales", "calculated_amount_upi");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

