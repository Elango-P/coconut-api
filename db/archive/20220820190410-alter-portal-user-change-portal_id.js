"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
          const tableDefinition = await queryInterface.describeTable(
            "portal_user"
        );
            if(tableDefinition && tableDefinition["portal_id"]) {
            return queryInterface.changeColumn(
                "portal_user",
                "portal_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                }
            );
              }
        } catch (err) {
            console.log(err);
        }
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            "portal_user",
            "portal_id",
            {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        );
    },
};