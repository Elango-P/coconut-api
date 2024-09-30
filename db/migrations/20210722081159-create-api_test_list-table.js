"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating api_test_list table");

    // Defining whether the api_test_list table already exist or not.
    const apiTestListTableExists = await queryInterface.tableExists("api_test_list");

    // Condition for creating the api_test_list table only if the table doesn't exist already.
    if (!apiTestListTableExists) {
      await queryInterface.createTable("api_test_list", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        method: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        headers: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        body: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        params: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        asserts: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        content_type: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        sort: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        company_id : {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        updated_by: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        created_by: {
          allownull: false,
          type: Sequelize.DATE,
        },
        created_at: {
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
    // Defining whether the api_test_list table already exist or not.
    const apiTestListTableExists = await queryInterface.tableExists("api_test_list");

    // Condition for dropping the api_test_list table only if the table exist already.
    if (apiTestListTableExists) {
      await queryInterface.dropTable("api_test_list");
    };
  } catch (err) {
    console.log(err);
  };
};
