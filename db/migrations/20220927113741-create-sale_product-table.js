"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating sale_product table");

      // Defining whether the sale_product table already exist or not.
      const saleProductTableExists = await queryInterface.tableExists("sale_product");

      // Condition for creating the sale_product table only if the table doesn't exist already.
      if (!saleProductTableExists) {
        await queryInterface.createTable("sale_product", {
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
          sale_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
  
          unit_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
  
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
  
          price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          cost_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          mrp: {
            type: Sequelize.DECIMAL,
            allowNull: true,
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
          item: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          amount: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          }
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the sale_product table already exist or not.
      const saleProductTableExists = await queryInterface.tableExists("sale_product");

      // Condition for dropping the sale_product table only if the table exist already.
      if (saleProductTableExists) {
        await queryInterface.dropTable("sale_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
