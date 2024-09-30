"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("candidate_profile")
            .then(tableDefinition => {
                if (
                    tableDefinition &&
                    !tableDefinition["vaccine_status"]
                ) {
                    return queryInterface.addColumn(
                        "candidate_profile",
                        "vaccine_status",
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