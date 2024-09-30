"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding Vendor Invoice Date to purchase table");
        
        const tableDefinition = await queryInterface.describeTable("purchase");

        if (tableDefinition && !tableDefinition["vendor_invoice_date"]) {
            await queryInterface.addColumn("purchase", "vendor_invoice_date", {
                type: Sequelize.DATEONLY,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("purchase");

        if (tableDefinition && tableDefinition["vendor_invoice_date"]) {
            await queryInterface.removeColumn("purchase", "vendor_invoice_date");
        }
    },
};
