"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Alter location_product Table: Add Status column");
        try {
            const tableDefinition = await queryInterface.describeTable(
                "location_product"
            );

            if (tableDefinition && !tableDefinition["status"]) {
                return queryInterface.addColumn("location_product", "status", {
                    type: Sequelize.STRING,
                    allowNull: true
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: (queryInterface) => {
        console.log("Alter location_product Table: Remove Status column");
        return queryInterface.removeColumn("location_product", "status");
    },
};