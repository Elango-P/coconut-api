"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("scheduler_job");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("scheduler_job", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("scheduler_job", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("scheduler_job");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("scheduler_job", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("scheduler_job", "portal_id");
      }
    },
};
