"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating user_role_permission table");

            // Defining whether the user_role_permission table already exist or not.
            const userRolePermissionTableExists = await queryInterface.tableExists("user_role_permission");

            // Condition for creating the user_role_permission table only if the table doesn't exist already.
            if (!userRolePermissionTableExists) {
                await queryInterface.createTable("user_role_permission", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    role_permission: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    role_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the user_role_permission table already exist or not.
            const userRolePermissionTableExists = await queryInterface.tableExists("user_role_permission");
      
            // Condition for dropping the user_role_permission table only if the table exist already.
            if (userRolePermissionTableExists) {
              await queryInterface.dropTable("user_role_permission");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
