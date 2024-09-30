"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating api_test_results table");

    // Defining whether the api_test_results table already exist or not.
    const apiTestResultsTableExists = await queryInterface.tableExists("api_test_results");

    // Condition for creating the api_test_results table only if the table doesn't exist already.
    if (!apiTestResultsTableExists) {
      await queryInterface.createTable("api_test_results", {
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
        result: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        total_time: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        http_code: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        test_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        method: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        content_type: {
          allowNull: true,
          type: Sequelize.STRING,
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
        asserts_results: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        project_id: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        api_id: {
          allowNull: true,
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
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the api_test_results table already exist or not.
    const apiTestResultsTableExists = await queryInterface.tableExists("api_test_results");

    // Condition for dropping the api_test_results table only if the table exist already.
    if (apiTestResultsTableExists) {
      await queryInterface.dropTable("api_test_results");
    };
  } catch (err) {
    console.log(err);
  };
};
