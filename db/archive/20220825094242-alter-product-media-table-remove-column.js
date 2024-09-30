"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_media");

    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("product_media", "status");
    }

    if (tableDefinition && tableDefinition["file_name"]) {
      await queryInterface.removeColumn("product_media", "file_name");
    }

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.removeColumn("product_media", "description");
    }

    if (tableDefinition && tableDefinition["portal_id"]) {
      await queryInterface.removeColumn("product_media", "portal_id");
    }

    if (tableDefinition && tableDefinition["position"]) {
      await queryInterface.removeColumn("product_media", "position");
    }

    if (tableDefinition && tableDefinition["name"]) {
      await queryInterface.removeColumn("product_media", "name");
    }

    if (tableDefinition && !tableDefinition["media_id"]) {
      await queryInterface.addColumn("product_media", "media_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_media");

    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("product_media", "status", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["file_name"]) {
      await queryInterface.addColumn("product_media", "file_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["description"]) {
      await queryInterface.addColumn("product_media", "description", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("product_media", "portal_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["position"]) {
      await queryInterface.addColumn("product_media", "position", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["name"]) {
      await queryInterface.addColumn("product_media", "name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["media_id"]) {
      await queryInterface.removeColumn("product_media", "media_id");
    }
  },
};
