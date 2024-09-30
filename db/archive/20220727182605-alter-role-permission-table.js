"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        try {
            return queryInterface.changeColumn(
                "role_permission",
                "permission_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                }
            );
        } catch (err) {
            console.log(err);
        }
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            "role_permission",
            "permission_id",
            {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        );
    },
};