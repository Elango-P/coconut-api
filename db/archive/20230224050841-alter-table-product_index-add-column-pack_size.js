"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log(
        "Altering product_index table - Adding pack_size column"
      );

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for adding the pack_size column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["pack_size"]) {
        await queryInterface.addColumn("product_index", "pack_size", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("product_index");

      // Condition for removing the pack_size column if it's exist in the table
      if (tableDefinition && tableDefinition["pack_size"]) {
        await queryInterface.removeColumn("product_index", "pack_size");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
