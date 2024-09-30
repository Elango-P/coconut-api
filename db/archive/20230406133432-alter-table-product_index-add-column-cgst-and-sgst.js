"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");

        if (tableDefinition && !tableDefinition["cgst_percentage"]) {
            await queryInterface.addColumn("product_index", "cgst_percentage", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["sgst_percentage"]) {
          await queryInterface.addColumn("product_index", "sgst_percentage", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
        if (tableDefinition && !tableDefinition["cgst_amount"]) {
          await queryInterface.addColumn("product_index", "cgst_amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
     
        if (tableDefinition && !tableDefinition["sgst_amount"]) {
          await queryInterface.addColumn("product_index", "sgst_amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");

        if (tableDefinition && tableDefinition["cgst_percentage"]) {
            await queryInterface.removeColumn("product_index", "cgst_percentage", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
        }

        if (tableDefinition && tableDefinition["sgst_percentage"]) {
            await queryInterface.removeColumn("product_index", "sgst_percentage", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && tableDefinition["cgst_amount"]) {
          await queryInterface.removeColumn("product_index", "cgst_amount", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["sgst_amount"]) {
          await queryInterface.removeColumn("product_index", "sgst_amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
    },
};
