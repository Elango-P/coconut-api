"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("inventory")
            .then(tableDefinition => {
                if (
                    tableDefinition &&
                    !tableDefinition["deletedAt"]
                ) {
                    return queryInterface.addColumn(
                        "inventory",
                        "deletedAt",
                        {
                            type: Sequelize.STRING,
                            allowNull: true,
                        }
                    );
                } else {
                    return Promise.resolve(true);
                }
            })
    },
};