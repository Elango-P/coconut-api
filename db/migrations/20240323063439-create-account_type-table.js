"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating account_type table");

    // Defining whether the account_type table already exist or not.
    const AccountTypeExist = await queryInterface.tableExists("account_type");

    // Condition for creating the account_type table only if the table doesn't exist already.
    if (!AccountTypeExist) {
      await queryInterface.createTable("account_type", {
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
        category: {
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
      });
    };
  } catch (err) {
    console.log(err);
  };

};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the account_type table already exist or not.
    const AccountTypeExist = await queryInterface.tableExists("account_type");

    // Condition for dropping the account_type table only if the table exist already.
    if (AccountTypeExist) {
      await queryInterface.dropTable("account_type");
    };
  } catch (err) {
    console.log(err);
  };
};
