"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && !tableDefinition["price"]) {
                return queryInterface.addColumn(
                    "product",
                    "price",
                    {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["price"]) {
          await queryInterface.removeColumn("product", "price");
      }

    }
};
