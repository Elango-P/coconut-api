"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product_media table");

      // Defining whether the product_media table already exist or not.
      const productMediaTableExists = await queryInterface.tableExists("product_media");

      // Condition for creating the product_media table only if the table doesn't exist already.
      if (!productMediaTableExists) {
        await queryInterface.createTable("product_media", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          feature: {
            type: Sequelize.STRING,
            allowNull: true
          },
          media_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          status: {
            type: Sequelize.TEXT,
            allowNull: true
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the product_media table already exist or not.
      const productMediaTableExists = await queryInterface.tableExists("product_media");

      // Condition for dropping the product_media table only if the table exist already.
      if (productMediaTableExists) {
        await queryInterface.dropTable("product_media");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
