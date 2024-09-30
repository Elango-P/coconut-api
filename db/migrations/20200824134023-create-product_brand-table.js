"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product_brand table");

      // Defining whether the product_brand table already exist or not.
      const productBrandTableExists = await queryInterface.tableExists("product_brand");

      // Condition for creating the product_brand table only if the table doesn't exist already.
      if (!productBrandTableExists) {
        await queryInterface.createTable("product_brand", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
          },
          image: {
            type: Sequelize.STRING,
          },
          status: {
            type: Sequelize.STRING,
          },
          manufacture_id: {
            type: Sequelize.INTEGER,
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
            allowNull: false,
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
      // Defining whether the product_brand table already exist or not.
      const productBrandTableExists = await queryInterface.tableExists("product_brand");

      // Condition for dropping the product_brand table only if the table exist already.
      if (productBrandTableExists) {
        await queryInterface.dropTable("product_brand");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
