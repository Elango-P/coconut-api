'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase_product table - Adding discount_percentage column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for adding the discount_percentage column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["discount_percentage"]) {
        await queryInterface.addColumn("purchase_product", "discount_percentage", {
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
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for removing the discount_percentage column if it's exist in the table
      if (tableDefinition && tableDefinition["discount_percentage"]) {
        await queryInterface.removeColumn("purchase_product", "discount_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
