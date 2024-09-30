'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating FIne table");

      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("fine_type");

      // Condition for creating the product_price table only if the table doesn't exist already.
      if (!fineTableExists) {
        await queryInterface.createTable("fine_type", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
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
          company_id: {
            type: Sequelize.INTEGER,
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
      // Defining whether the product_price table already exist or not.
      const fineTableExists = await queryInterface.tableExists("fine_type");

      // Condition for dropping the product_price table only if the table exist already.
      if (fineTableExists) {
        await queryInterface.dropTable("fine_type");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
