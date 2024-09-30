"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const tableDefinition = await queryInterface.describeTable(
                "company"
            );
            if (tableDefinition && !tableDefinition["status"]) {
                queryInterface.addColumn("company", "status", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["websiteurl"]) {
                queryInterface.addColumn("company", "websiteurl", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["description"]) {
                queryInterface.addColumn("company", "description", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["email"]) {
                queryInterface.addColumn("company", "email", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["company_logo"]) {
                queryInterface.addColumn("company", "company_logo", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["mobile_number1"]) {
                queryInterface.addColumn("company", "mobile_number1", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["mobile_number2"]) {
                queryInterface.addColumn("company", "mobile_number2", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["address1"]) {
                queryInterface.addColumn("company", "address1", {
                    type: Sequelize.TEXT,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["address2"]) {
                queryInterface.addColumn("company", "address2", {
                    type: Sequelize.TEXT,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["city"]) {
                queryInterface.addColumn("company", "city", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["state"]) {
                queryInterface.addColumn("company", "state", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["country"]) {
                queryInterface.addColumn("company", "country", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["pin_code"]) {
                queryInterface.addColumn("company", "pin_code", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["facebook_url"]) {
                queryInterface.addColumn("company", "facebook_url", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["instagram_url"]) {
                queryInterface.addColumn("company", "instagram_url", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["twitter_url"]) {
                queryInterface.addColumn("company", "twitter_url", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["linkedIn_url"]) {
                queryInterface.addColumn("company", "linkedIn_url", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["youtube_url"]) {
                queryInterface.addColumn("company", "youtube_url", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("company");
        if (tableDefinition && tableDefinition["status"]) {
            queryInterface.removeColumn("company", "status");
        }
        if (tableDefinition && tableDefinition["websiteurl"]) {
            queryInterface.removeColumn("company", "websiteurl");
        }
        if (tableDefinition && tableDefinition["description"]) {
            queryInterface.removeColumn("company", "description");
        }
        if (tableDefinition && tableDefinition["email"]) {
            queryInterface.removeColumn("company", "email");
        }
        if (tableDefinition && tableDefinition["company_logo"]) {
            queryInterface.removeColumn("company", "company_logo");
        }
        if (tableDefinition && tableDefinition["mobile_number1"]) {
            queryInterface.removeColumn("company", "mobile_number1");
        }
        if (tableDefinition && tableDefinition["mobile_number2"]) {
            queryInterface.removeColumn("company", "mobile_number2");
        }
        if (tableDefinition && tableDefinition["address1"]) {
            queryInterface.removeColumn("company", "address1");
        }
        if (tableDefinition && tableDefinition["address2"]) {
            queryInterface.removeColumn("company", "address2");
        }
        if (tableDefinition && tableDefinition["city"]) {
            queryInterface.removeColumn("company", "city");
        }
        if (tableDefinition && tableDefinition["state"]) {
            queryInterface.removeColumn("company", "state");
        }
        if (tableDefinition && tableDefinition["country"]) {
            queryInterface.removeColumn("company", "country");
        }
        if (tableDefinition && tableDefinition["pin_code"]) {
            queryInterface.removeColumn("company", "pin_code");
        }
        if (tableDefinition && tableDefinition["facebook_url"]) {
            queryInterface.removeColumn("company", "facebook_url");
        }
        if (tableDefinition && tableDefinition["instagram_url"]) {
            queryInterface.removeColumn("company", "instagram_url");
        }
        if (tableDefinition && tableDefinition["twitter_url"]) {
            queryInterface.removeColumn("company", "twitter_url");
        }
        if (tableDefinition && tableDefinition["linkedIn_url"]) {
            queryInterface.removeColumn("company", "linkedIn_url");
        }
        if (tableDefinition && tableDefinition["youtube_url"]) {
            queryInterface.removeColumn("company", "youtube_url");
        }
    },
};
