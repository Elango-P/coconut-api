"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "transfer_product"
        );

        if (tableDefinition && !tableDefinition["from_store_id"]) {
            await queryInterface.addColumn("transfer_product", "from_store_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["to_store_id"]) {
            await queryInterface.addColumn("transfer_product", "to_store_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["type"]) {
          await queryInterface.addColumn("transfer_product", "type", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "transfer_product"
        );

        if (tableDefinition && tableDefinition["from_store_id"]) {
            await queryInterface.removeColumn(
                "transfer_product",
                "from_store_id"
            );
        }

        if (tableDefinition && tableDefinition["to_store_id"]) {
            await queryInterface.removeColumn(
                "transfer_product",
                "to_store_id"
            );
        }

        if (tableDefinition && tableDefinition["type"]) {
          await queryInterface.removeColumn(
              "transfer_product",
              "type"
          );
      }


    },
};
