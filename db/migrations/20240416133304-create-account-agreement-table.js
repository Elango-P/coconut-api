"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating account_agreement table");

            // Defining whether the account_agreement table already exist or not.
            const accountTableExists = await queryInterface.tableExists("account_agreement");

            // Condition for creating the account_agreement table only if the table doesn't exist already.
            if (!accountTableExists) {
                await queryInterface.createTable("account_agreement", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    account_id: {
                      type: Sequelize.INTEGER,
                      allowNull: false
                    },
                    agreement_start_date: {
                      type: Sequelize.DATEONLY,
                      allowNull: true,
                    },
                    agreement_end_date: {
                      type: Sequelize.DATEONLY,
                      allowNull: true,
                    },
                    agreement_renewal_date: {
                      type: Sequelize.DATEONLY,
                      allowNull: true,
                    },
                    agreement_term: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
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
            // Defining whether the account_agreement table already exist or not.
            const accountTableExists = await queryInterface.tableExists("account_agreement");
      
            // Condition for dropping the account_agreement table only if the table exist already.
            if (accountTableExists) {
              await queryInterface.dropTable("account_agreement");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
