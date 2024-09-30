"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("purchase_product");

        if (tableDefinition && !tableDefinition["cgst_percentage"]) {
            await queryInterface.addColumn("purchase_product", "cgst_percentage", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["sgst_percentage"]) {
          await queryInterface.addColumn("purchase_product", "sgst_percentage", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }

      if (tableDefinition && !tableDefinition["sgst_percentage"]) {
        await queryInterface.addColumn("purchase_product", "cess_percentage", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
    }
        if (tableDefinition && !tableDefinition["cgst_amount"]) {
          await queryInterface.addColumn("purchase_product", "cgst_amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
     
        if (tableDefinition && !tableDefinition["sgst_amount"]) {
          await queryInterface.addColumn("purchase_product", "sgst_amount", {
              type: Sequelize.DECIMAL, 
              allowNull: true,
          });
      }
      if (tableDefinition && !tableDefinition["sgst_amount"]) {
        await queryInterface.addColumn("purchase_product", "cess_amount", {
            type: Sequelize.DECIMAL, 
            allowNull: true,
        });
    }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("purchase_product");

        if (tableDefinition && tableDefinition["cgst_percentage"]) {
            await queryInterface.removeColumn("purchase_product", "cgst_percentage", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
        }

        if (tableDefinition && tableDefinition["sgst_percentage"]) {
            await queryInterface.removeColumn("purchase_product", "sgst_percentage", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }

        if (tableDefinition && tableDefinition["sgst_percentage"]) {
          await queryInterface.removeColumn("purchase_product", "cess_percentage", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }

        if (tableDefinition && tableDefinition["cgst_amount"]) {
          await queryInterface.removeColumn("purchase_product", "cgst_amount", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
      }

      if (tableDefinition && tableDefinition["sgst_amount"]) {
          await queryInterface.removeColumn("purchase_product", "sgst_amount", {
              type: Sequelize.DECIMAL,
              allowNull: true,
          });
      }
      if (tableDefinition && tableDefinition["sgst_amount"]) {
        await queryInterface.removeColumn("purchase_product", "cess_amount", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
    }
    },
};
