"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
          const tableDefinition = await queryInterface.describeTable(
            "tag"
        );
            if(tableDefinition && tableDefinition["type"]) {
            return queryInterface.changeColumn(
                "tag",
                "type",
                {
                  type:  'INTEGER USING CAST("type" as INTEGER)',
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
            "tag",
            "type",
            {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        );
    },
};