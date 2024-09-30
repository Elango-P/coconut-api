"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("holiday");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("holiday", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("holiday", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("holiday");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("holiday", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("holiday", "portal_id");
      }
    },
};
