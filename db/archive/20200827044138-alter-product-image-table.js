"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface
            .describeTable("product_image")
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["file_name"]) {
                    return queryInterface.addColumn(
                        "product_image",
                        "file_name",
                        {
                            type: Sequelize.STRING,
                            allowNull: true,
                        }
                    );
                } else {
                    return Promise.resolve(true);
                }
            });
    },
};
