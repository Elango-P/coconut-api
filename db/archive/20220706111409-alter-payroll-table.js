"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("payroll");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("payroll", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("payroll", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("payroll");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("payroll", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("payroll", "portal_id");
      }
    },
};