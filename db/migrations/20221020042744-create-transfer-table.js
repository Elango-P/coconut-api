"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating transfer table");

      // Defining whether the transfer table already exist or not.
      const transferTableExists = await queryInterface.tableExists("transfer");

      // Condition for creating the transfer table only if the table doesn't exist already.
      if (!transferTableExists) {
        await queryInterface.createTable("transfer", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          from_store_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          to_store_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
          },
          status: {
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
            allowNull: true,
            type: Sequelize.DATE,
          }, 
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          type: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          transfer_number: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        due_date:{
          type:Sequelize.DATEONLY,
          allowNull:true
        }
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the transfer table already exist or not.
      const transferTableExists = await queryInterface.tableExists("transfer");

      // Condition for dropping the transfer table only if the table exist already.
      if (transferTableExists) {
        await queryInterface.dropTable("transfer");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
