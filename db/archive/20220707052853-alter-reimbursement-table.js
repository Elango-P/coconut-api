"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("reimbursement", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("reimbursement", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("reimbursement");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("reimbursement", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("reimbursement", "portal_id");
      }
    },
};