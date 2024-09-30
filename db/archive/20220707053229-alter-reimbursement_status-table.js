"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement_status");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("reimbursement_status", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("reimbursement_status", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement_status");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("reimbursement_status", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("reimbursement_status", "portal_id");
      }
    },
};