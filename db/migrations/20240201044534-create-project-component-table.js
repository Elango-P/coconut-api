'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Creating project_component table");

      // Defining whether the project_component table already exist or not.
      const projectComponentTableExists = await queryInterface.tableExists("project_component");

      // Condition for creating the project_component table only if the table doesn't exist already.
      if (!projectComponentTableExists) {
        await queryInterface.createTable("project_component", {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          project_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down(queryInterface) {
    try {
      // Defining whether the project_component table already exist or not.
      const projectComponentTableExists = await queryInterface.tableExists("project_component");

      // Condition for dropping the project_component table only if the table exist already.
      if (projectComponentTableExists) {
        await queryInterface.dropTable("project_component");
      };
    } catch (err) {
      console.log(err);
    };
  }
};
