"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating company_user table");

            // Defining whether the company_user table already exist or not.
            const companyUserTableExists = await queryInterface.tableExists("company_user");

            // Condition for creating the company_user table only if the table doesn't exist already.
            if (!companyUserTableExists) {
                await queryInterface.createTable("company_user", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    user_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
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
            // Defining whether the company_user table already exist or not.
            const companyUserTableExists = await queryInterface.tableExists("company_user");
      
            // Condition for dropping the company_user table only if the table exist already.
            if (companyUserTableExists) {
              await queryInterface.dropTable("company_user");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
