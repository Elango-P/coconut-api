"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("candidate_message");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("candidate_message", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("candidate_message", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("candidate_message");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("candidate_message", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("candidate_message", "portal_id");
      }
    },
};