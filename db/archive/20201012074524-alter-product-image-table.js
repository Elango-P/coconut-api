"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("product_image", "product_media");
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameTable("product_media", "product_image");
    },
};
