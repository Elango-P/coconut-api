"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
          console.log("Alter Table: Add company_id to product_category table");
            const tableDefinition = await queryInterface.describeTable(
                "product_category"
            );

            if (tableDefinition && !tableDefinition["company_id"]) {
                return queryInterface.addColumn("product_category", "company_id", {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn("product_category", "company_id");
    },
};