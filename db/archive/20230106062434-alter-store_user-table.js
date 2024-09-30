"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("store_user", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      store_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      shift_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("store_user");
  },
};