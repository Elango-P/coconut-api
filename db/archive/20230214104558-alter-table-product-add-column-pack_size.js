"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering product table - Adding pack_size column");

      // Defining whether the product table already exist or not.
      const productTableExists = await queryInterface.tableExists("product");

      // Condition for altering the table only if the table is exist.
      if (productTableExists) {
        // Defining the table
        const productTableDefinition = await queryInterface.describeTable("product");

        // Condition for adding the pack_size column if it doesn't exist in the table.
        if (productTableDefinition && !productTableDefinition["pack_size"]) {
          await queryInterface.addColumn("product", "pack_size", {
            type: Sequelize.INTEGER,
            allowNull: true
          });
        };
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining whether the product table already exist or not.
      const productTableExists = await queryInterface.tableExists("product");

      // Condition for altering the table only if the table is exist.
      if (productTableExists) {
        // Defining the table
        const productTableDefinition = await queryInterface.describeTable("product");

        // Condition for removing the pack_size column if it's exist in the table.
        if (productTableDefinition && productTableDefinition["pack_size"]) {
          await queryInterface.removeColumn("product", "pack_size");
        };
      };
    } catch (err) {
      console.log(err);
    };
  },
};
