"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("tag");

        if (tableDefinition && !tableDefinition["type"]) {
            await queryInterface.addColumn("tag", "type", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["status"]) {
          await queryInterface.addColumn("tag", "status", {
              type: Sequelize.STRING,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("type");

        if (tableDefinition && tableDefinition["type"]) {
            await queryInterface.removeColumn("tag", "type");
        }
        if (tableDefinition && tableDefinition["status"]) {
          await queryInterface.removeColumn("tag", "status");
      }
    },
};