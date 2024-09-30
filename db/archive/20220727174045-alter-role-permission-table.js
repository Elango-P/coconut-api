"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const tableDefinition = await queryInterface.describeTable("role_permission");

            if (tableDefinition && !tableDefinition["name"]) {
                queryInterface.addColumn("role_permission", "name", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["portal_id"]) {
                queryInterface.addColumn("role_permission", "portal_id", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["company_id"]) {
              queryInterface.addColumn("role_permission", "company_id", {
                  type: Sequelize.STRING,
                  allowNull: true,
              });
          }
           
        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("role_permission");

        if (tableDefinition && tableDefinition["name"]) {
            queryInterface.removeColumn("role_permission", "name");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
            queryInterface.removeColumn("role_permission", "portal_id");
        }
        if (tableDefinition && tableDefinition["company_id"]) {
            queryInterface.removeColumn("role_permission", "company_id");
        }
    },
};
