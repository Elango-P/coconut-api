"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating permission table");

    // Defining whether the permission table already exist or not.
    const permissionTableExists = await queryInterface.tableExists("permission");

    // Condition for creating the permission table only if the table doesn't exist already.
    if (!permissionTableExists) {
      await queryInterface.createTable("permission", {
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
        display_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        feature_name: {
          type: Sequelize.TEXT,
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
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the permission table already exist or not.
    const permissionTableExists = await queryInterface.tableExists("permission");

    // Condition for dropping the permission table only if the table exist already.
    if (permissionTableExists) {
      await queryInterface.dropTable("permission");
    };
  } catch (err) {
    console.log(err);
  };
};
