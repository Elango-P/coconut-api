'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase_product table - Adding mrp column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for adding the mrp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["mrp"]) {
        await queryInterface.addColumn("purchase_product", "mrp", {
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

      // Condition for removing the mrp column if it's exist in the table
      if (tableDefinition && tableDefinition["mrp"]) {
        await queryInterface.removeColumn("purchase_product", "mrp");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
