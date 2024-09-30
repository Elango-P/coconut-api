"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating location_rack table");

    // Defining whether the location_rack table already exist or not.
    const TableDefination = await queryInterface.tableExists("location_rack");

    // Condition for creating the location_rack table only if the table doesn't exist already.
    if (!TableDefination) {
      await queryInterface.createTable("location_rack", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        location_id: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        status: {
          allowNull: true,
          type: Sequelize.INTEGER,
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
    // Defining whether the location_rack table already exist or not.
    const TableDefination = await queryInterface.tableExists("location_rack");

    // Condition for dropping the location_rack table only if the table exist already.
    if (TableDefination) {
      await queryInterface.dropTable("location_rack");
    };
  } catch (err) {
    console.log(err);
  };
};
