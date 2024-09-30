'use strict';

const { sequelize } = require("..");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating FIne table");

      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("fine");

      // Condition for creating the product_price table only if the table doesn't exist already.
      if (!fineTableExists) {
        await queryInterface.createTable("fine", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          date: {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          user: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          createdAt: {
            allowNull: true,
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
          reviewer: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
        
          notes: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          due_date:{
          
            type: Sequelize.DATEONLY,
            allowNull: true,

          },
          object_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          object_id: {
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
      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("fine");

      // Condition for dropping the product_price table only if the table exist already.
      if (fineTableExists) {
        await queryInterface.dropTable("fine");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
