"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["login_time"]) {
      await queryInterface.addColumn("user", "login_time",{
        type: Sequelize.TIME,
        allowNull: true,


      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["login_time"]) {
      await queryInterface.removeColumn("user", "login_time", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
  },
};

