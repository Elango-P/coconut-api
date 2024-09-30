"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("contact_us");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("contact_us", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("contact_us", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("contact_us");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("contact_us", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("contact_us", "portal_id");
      }
    },
};