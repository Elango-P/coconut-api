"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating transfer_type table");

    // Defining whether the transfer_type table already exist or not.
    const TransferTypeExist = await queryInterface.tableExists("transfer_type");

    // Condition for creating the transfer_type table only if the table doesn't exist already.
    if (!TransferTypeExist) {
      await queryInterface.createTable("transfer_type", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        default_from_store: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        default_to_store: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        allow_to_change_from_store: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        allow_to_change_to_store: {
          type: Sequelize.INTEGER,
          allowNull: true
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
        offline_mode: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        allowed_role_id: {
          type: Sequelize.STRING,
          allowNull: true 
        }
      });
    };
  } catch (err) {
    console.log(err);
  };

};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the transfer_type table already exist or not.
    const TransferTypeExist = await queryInterface.tableExists("transfer_type");

    // Condition for dropping the transfer_type table only if the table exist already.
    if (TransferTypeExist) {
      await queryInterface.dropTable("transfer_type");
    };
  } catch (err) {
    console.log(err);
  };
};
