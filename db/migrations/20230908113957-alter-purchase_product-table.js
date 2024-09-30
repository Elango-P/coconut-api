"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition) {
      // Change the type of cgst_amount, cess_amount, and sgst_amount columns to NUMERIC
      if (tableDefinition["cgst_amount"]) {
        await queryInterface.changeColumn("purchase_product", "cgst_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
        });
      }
      if (tableDefinition["cess_amount"]) {
        await queryInterface.changeColumn("purchase_product", "cess_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
        });
      }
      if (tableDefinition["sgst_amount"]) {
        await queryInterface.changeColumn("purchase_product", "sgst_amount", {
          type: Sequelize.NUMERIC,
          allowNull: true,
        });
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition) {
      // Change the type of cgst_amount, cess_amount, and sgst_amount columns back to INTEGER for the down migration
      if (tableDefinition["cgst_amount"]) {
        await queryInterface.changeColumn("purchase_product", "cgst_amount", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition["cess_amount"]) {
        await queryInterface.changeColumn("purchase_product", "cess_amount", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
      if (tableDefinition["sgst_amount"]) {
        await queryInterface.changeColumn("purchase_product", "sgst_amount", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    }
  },
};
