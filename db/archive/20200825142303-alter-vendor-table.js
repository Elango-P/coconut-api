"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename vendor table to product_brand");
        await queryInterface.renameTable("vendor", "product_brand");
        console.log("Drop product_vendor table");
        await queryInterface.dropTable("product_vendor");
    },
};
