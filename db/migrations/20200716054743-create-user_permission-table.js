"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
	  // Console log
    console.log("Creating user_permission table");

    // Defining whether the user_permission table already exist or not.
    const userPermissionTableExists = await queryInterface.tableExists("user_permission");

    // Condition for creating the user_permission table only if the table doesn't exist already.
    if (!userPermissionTableExists) {
      await queryInterface.createTable("user_permission", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        permission_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        display_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.INTEGER,
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
      });
    };
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user_permission table already exist or not.
    const userPermissionTableExists = await queryInterface.tableExists("user_permission");

    // Condition for dropping the user_permission table only if the table exist already.
    if (userPermissionTableExists) {
      await queryInterface.dropTable("user_permission");
    };
  } catch (err) {
    console.log(err);
  };
};
