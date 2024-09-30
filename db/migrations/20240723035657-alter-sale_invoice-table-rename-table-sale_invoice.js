"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Check if the sale_invoice table exists
            console.log("Checking for existence of sale_invoice table...");
            const tableExists = await queryInterface.describeTable("sale_invoice").catch(() => null);
            
            if (tableExists) {
                console.log("Renaming sale_invoice table to invoice");
                await queryInterface.renameTable("sale_invoice", "invoice");
                console.log("Successfully renamed table to invoice");
            } else {
                console.log("Table sale_invoice does not exist. Skipping rename operation.");
            }
        } catch (error) {
            console.error("Error during migration:", error);
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Check if the invoice table exists
            console.log("Checking for existence of invoice table...");
            const tableExists = await queryInterface.describeTable("invoice").catch(() => null);
            
            if (tableExists) {
                console.log("Renaming invoice table back to sale_invoice");
                await queryInterface.renameTable("invoice", "sale_invoice");
                console.log("Successfully renamed table back to sale_invoice");
            } else {
                console.log("Table invoice does not exist. Skipping rollback operation.");
            }
        } catch (error) {
            console.error("Error during rollback:", error);
        }
    },
};
