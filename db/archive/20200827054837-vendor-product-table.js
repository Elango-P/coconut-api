"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("vendor_product")
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["barcode"]) {
                    return queryInterface.addColumn(
                        "vendor_product",
                        "barcode",
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
