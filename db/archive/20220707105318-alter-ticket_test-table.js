"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("ticket_test");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("ticket_test", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("ticket_test", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("ticket_test");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("ticket_test", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("ticket_test", "portal_id");
      }
    },
};
