'use strict';

"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_media");

        if (tableDefinition && !tableDefinition["description"]) {
            await queryInterface.addColumn("product_media", "description", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["feature"]) {
          await queryInterface.addColumn("product_media", "feature", {
              type: Sequelize.STRING,
              allowNull: true,
          });
      }
      
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_media");

        if (tableDefinition && tableDefinition["description"]) {
            await queryInterface.removeColumn("product_media", "description");
        }
        if (tableDefinition && tableDefinition["feature"]) {
          await queryInterface.removeColumn("product_media", "feature");
      }
    },
};
