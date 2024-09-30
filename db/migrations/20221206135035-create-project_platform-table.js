"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating project_platform table");

            // Defining whether the project_platform table already exist or not.
            const projectPlatformTableExists = await queryInterface.tableExists("project_platform");

            // Condition for creating the project_platform table only if the table doesn't exist already.
            if (!projectPlatformTableExists) {
                await queryInterface.createTable("project_platform", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    platform_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    project_id: {
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
            // Defining whether the project_platform table already exist or not.
            const projectPlatformTableExists = await queryInterface.tableExists("project_platform");
      
            // Condition for dropping the project_platform table only if the table exist already.
            if (projectPlatformTableExists) {
              await queryInterface.dropTable("project_platform");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
