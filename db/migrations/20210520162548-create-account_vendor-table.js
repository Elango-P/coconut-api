"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating account_vendor table");

    // Defining whether the account_vendor table already exist or not.
    const accountVendorTableExists = await queryInterface.tableExists("account_vendor");

    // Condition for creating the account_vendor table only if the table doesn't exist already.
    if (!accountVendorTableExists) {
      await queryInterface.createTable("account_vendor", {
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
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address2: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        city: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        state: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        pin_code: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        country: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        bank_name: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        bank_account_number: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        bank_routing_number: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        status: {
          allownull: false,
          type: Sequelize.INTEGER,
        },
        company_id : {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
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
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the account_vendor table already exist or not.
    const accountVendorTableExists = await queryInterface.tableExists("account_vendor");

    // Condition for dropping the account_vendor table only if the table exist already.
    if (accountVendorTableExists) {
      await queryInterface.dropTable("account_vendor");
    };
  } catch (err) {
    console.log(err);
  };
};
