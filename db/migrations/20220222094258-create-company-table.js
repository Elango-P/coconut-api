"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating company table");

            // Defining whether the company table already exist or not.
            const companyTableExists = await queryInterface.tableExists("company");

            // Condition for creating the company table only if the table doesn't exist already.
            if (!companyTableExists) {
                await queryInterface.createTable("company", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    company_name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    status: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    websiteurl: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    description: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    email: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    company_logo: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    mobile_number1: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    mobile_number2: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    address1: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    address2: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    city: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    state: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    country: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    pin_code: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    facebook_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    instagram_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    twitter_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    linkedIn_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    youtube_url: {
                        type: Sequelize.STRING,
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
                    portal_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    template: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    gst_number: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    portal_api_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the company table already exist or not.
            const companyTableExists = await queryInterface.tableExists("company");
      
            // Condition for dropping the company table only if the table exist already.
            if (companyTableExists) {
              await queryInterface.dropTable("company");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
