"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("product")
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["brand_id"]) {
                    return queryInterface.addColumn("product", "brand_id", {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    });
                } else {
                    return Promise.resolve(true);
                }
            })
            .then(tableDefinition => {
                // if (tableDefinition && !tableDefinition["category_id"]) {
                //     return queryInterface.addColumn("product", "category_id", {
                //         type: Sequelize.INTEGER,
                //         allowNull: true,
                //     });
                // } else {
                //     return Promise.resolve(true);
                // }
            });
    },
};
