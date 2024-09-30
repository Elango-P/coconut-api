"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
          console.log("Alter Table: Add company_id to setting table");
            const tableDefinition = await queryInterface.describeTable(
                "setting"
            );

            if (tableDefinition && !tableDefinition["company_id"]) {
                return queryInterface.addColumn("setting", "company_id", {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn("setting", "company_id");
    },
};