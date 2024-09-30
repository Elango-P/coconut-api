"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        let tableDefinition = await queryInterface.describeTable("system_setting");
        if (tableDefinition && tableDefinition["module"]) {
            queryInterface.removeColumn("system_setting", "module");
        }

        if (tableDefinition && tableDefinition["portal_id"]) {
             queryInterface.removeColumn("system_setting", "portal_id");
        }

        if (tableDefinition && tableDefinition["company_id"]) {
             queryInterface.removeColumn("system_setting", "company_id");
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("system_setting");

        if (tableDefinition && !tableDefinition["module"]) {
            queryInterface.addColumn("system_setting", "module", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["portal_id"]) {
            queryInterface.addColumn("system_setting", "portal_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["company_id"]) {
            queryInterface.addColumn("system_setting", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    }
};
