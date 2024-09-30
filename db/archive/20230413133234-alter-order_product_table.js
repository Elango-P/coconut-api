"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("add column in order product table");
      const tableDefinition = await queryInterface.describeTable("order_product");

      if (tableDefinition && !tableDefinition["mrp"]) {
        await queryInterface.addColumn("order_product", "mrp", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["cgst_percentage"]) {
        await queryInterface.addColumn("order_product", "cgst_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }


      if (tableDefinition && !tableDefinition["cgst_amount"]) {
        await queryInterface.addColumn("order_product", "cgst_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["sgst_percentage"]) {
        await queryInterface.addColumn("order_product", "sgst_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["sgst_amount"]) {
        await queryInterface.addColumn("order_product", "sgst_amount", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {

    const tableDefinition = await queryInterface.describeTable("order_product");

    if (tableDefinition && tableDefinition["mrp"]) {
      await queryInterface.removeColumn("order_product", "mrp")
    }

    if (tableDefinition && tableDefinition["cgst_percentage"]) {
      await queryInterface.removeColumn("order_product", "cgst_percentage")
    }

    if (tableDefinition && tableDefinition["cgst_amount"]) {
      await queryInterface.removeColumn("order_product", "cgst_amount")
    }

    if (tableDefinition && tableDefinition["sgst_percentage"]) {
      await queryInterface.removeColumn("order_product", "sgst_percentage")
    }

    if (tableDefinition && tableDefinition["sgst_amount"]) {
      await queryInterface.removeColumn("order_product", "sgst_amount")
    }
  },
};
