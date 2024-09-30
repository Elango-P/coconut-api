"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("attendance", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("attendance", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("attendance");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("attendance", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("attendance", "portal_id");
      }
    },
};
