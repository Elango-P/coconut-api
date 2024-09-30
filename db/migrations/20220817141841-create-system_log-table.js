"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating system_log table");

            // Defining whether the system_log table already exist or not.
            const systemLogTableExists = await queryInterface.tableExists("system_log");

            // Condition for creating the system_log table only if the table doesn't exist already.
            if (!systemLogTableExists) {
                await queryInterface.createTable("system_log", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    message: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    user_id: {
                      type: Sequelize.INTEGER,
                      allowNull: true,
                    },
                    company_id: {
                      type: Sequelize.INTEGER,
                      allowNull: true,
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
                    object_name: {
                        type: Sequelize.TEXT,
                        allowNull: true
                    },
                    object_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true
                    },
                    activity: {
                        type: Sequelize.STRING,
                        allowNull: true
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },
    
    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the system_log table already exist or not.
            const systemLogTableExists = await queryInterface.tableExists("system_log");
      
            // Condition for dropping the system_log table only if the table exist already.
            if (systemLogTableExists) {
              await queryInterface.dropTable("system_log");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
