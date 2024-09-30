"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Alter location_product Table: Add Quantity column");
        try {
            const tableDefinition = await queryInterface.describeTable(
                "location_product"
            );

            if (tableDefinition && !tableDefinition["quantity"]) {
                return queryInterface.addColumn("location_product", "quantity", {
                    type: Sequelize.INTEGER,
                    allowNull: true
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: (queryInterface) => {
        console.log("Alter location_product Table: Remmove Quantity column");
        return queryInterface.removeColumn("location_product", "quantity");
    },
};