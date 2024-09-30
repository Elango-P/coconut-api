"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating app_setting table");

            // Defining whether the app_setting table already exist or not.
            const appSettingTableExists = await queryInterface.tableExists("app_setting");

            // Condition for creating the app_setting table only if the table doesn't exist already.
            if (!appSettingTableExists) {
                await queryInterface.createTable("app_setting", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    app_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    value: {
                        type: Sequelize.TEXT,
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
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },
    
    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the app_setting table already exist or not.
            const appSettingTableExists = await queryInterface.tableExists("app_setting");
      
            // Condition for dropping the app_setting table only if the table exist already.
            if (appSettingTableExists) {
              await queryInterface.dropTable("app_setting");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
