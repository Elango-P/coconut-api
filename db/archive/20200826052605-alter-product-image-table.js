"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("product_image")
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["status"]) {
                    return queryInterface.addColumn("product_image", "status", {
                        type: Sequelize.STRING,
                        defaultValue: "Active",
                    });
                } else {
                    return Promise.resolve(true);
                }
            });
    },
};
