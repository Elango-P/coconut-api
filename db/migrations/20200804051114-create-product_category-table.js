"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product_category table");

      // Defining whether the product_category table already exist or not.
      const productCategoryTableExists = await queryInterface.tableExists("product_category");

      // Condition for creating the product_category table only if the table doesn't exist already.
      if (!productCategoryTableExists) {
        await queryInterface.createTable("product_category", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.STRING,
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
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          order_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },
  
  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the product_category table already exist or not.
      const productCategoryTableExists = await queryInterface.tableExists("product_category");

      // Condition for dropping the product_category table only if the table exist already.
      if (productCategoryTableExists) {
        await queryInterface.dropTable("product_category");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
