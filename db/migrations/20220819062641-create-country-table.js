'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating country table");

      // Defining whether the country table already exist or not.
      const countryTableExists = await queryInterface.tableExists("country");

      // Condition for creating the country table only if the table doesn't exist already.
      if (!countryTableExists) {
        await queryInterface.createTable("country", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          country_name: {
            type: Sequelize.STRING,
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
          company_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the country table already exist or not.
      const countryTableExists = await queryInterface.tableExists("country");

      // Condition for dropping the country table only if the table exist already.
      if (countryTableExists) {
        await queryInterface.dropTable("country");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
