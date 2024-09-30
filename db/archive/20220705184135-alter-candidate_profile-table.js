"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("candidate_profile");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("candidate_profile", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("candidate_profile", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("candidate_profile");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("candidate_profile", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("candidate_profile", "portal_id");
      }
    },
};