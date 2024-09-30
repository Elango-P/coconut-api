"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement_type");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("reimbursement_type", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("reimbursement_type", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement_type");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("reimbursement_type", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("reimbursement_type", "portal_id");
      }
    },
};