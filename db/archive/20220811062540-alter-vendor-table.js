"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");

    if (tableDefinition && !tableDefinition["email"]) {
      await queryInterface.addColumn("vendor", "email", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["mobile"]) {
      await queryInterface.addColumn("vendor", "mobile", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["work_phone"]) {
      await queryInterface.addColumn("vendor", "work_phone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["address1"]) {
      await queryInterface.addColumn("vendor", "address1", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["address2"]) {
      await queryInterface.addColumn("vendor", "address2", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["city"]) {
      await queryInterface.addColumn("vendor", "city", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["country"]) {
      await queryInterface.addColumn("vendor", "country", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["state"]) {
      await queryInterface.addColumn("vendor", "state", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["pin_code"]) {
      await queryInterface.addColumn("vendor", "pin_code", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("vendor");

    if (tableDefinition && tableDefinition["email"]) {
      await queryInterface.removeColumn("vendor", "email");
    }
    if (tableDefinition && tableDefinition["mobile"]) {
      await queryInterface.removeColumn("vendor", "mobile");
    }
    if (tableDefinition && tableDefinition["work_phone"]) {
      await queryInterface.removeColumn("vendor", "work_phone");
    }
    if (tableDefinition && tableDefinition["address1"]) {
      await queryInterface.removeColumn("vendor", "address1");
    }
    if (tableDefinition && tableDefinition["address2"]) {
      await queryInterface.removeColumn("vendor", "address2");
    }
    if (tableDefinition && tableDefinition["city"]) {
      await queryInterface.removeColumn("vendor", "city");
    }
    if (tableDefinition && tableDefinition["country"]) {
      await queryInterface.removeColumn("vendor", "country");
    }
    if (tableDefinition && tableDefinition["state"]) {
      await queryInterface.removeColumn("vendor", "state");
    }
    if (tableDefinition && tableDefinition["pin_code"]) {
      await queryInterface.removeColumn("vendor", "pin_code");
    }
  },
};
