"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product_tag table");

      // Defining whether the product_tag table already exist or not.
      const productTagTableExists = await queryInterface.tableExists("product_tag");

      // Condition for creating the product_tag table only if the table doesn't exist already.
      if (!productTagTableExists) {
        await queryInterface.createTable("product_tag", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          tag_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the product_tag table already exist or not.
      const productTagTableExists = await queryInterface.tableExists("product_tag");

      // Condition for dropping the product_tag table only if the table exist already.
      if (productTagTableExists) {
        await queryInterface.dropTable("product_tag");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
