"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log(
        "Altering product table - Adding tax column"
      );

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for adding the tax and received_amount_upi.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["tax"]) {
        await queryInterface.addColumn("product", "tax", {
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
      const tableDefinition = await queryInterface.describeTable("product");

      // Condition for removing the tax column if it's exist in the table
      if (tableDefinition && tableDefinition["tax"]) {
        await queryInterface.removeColumn("product", "tax");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
