"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating api_project_category table");

    // Defining whether the api_project_category table already exist or not.
    const apiProjectCategoryTableExists = await queryInterface.tableExists("api_project_category");

    // Condition for creating the api_project_category table only if the table doesn't exist already.
    if (!apiProjectCategoryTableExists) {
      await queryInterface.createTable("api_project_category", {
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
        sort: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        status: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        company_id : {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        updated_at: {
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
    // Defining whether the api_project_category table already exist or not.
    const apiProjectCategoryTableExists = await queryInterface.tableExists("api_project_category");

    // Condition for dropping the api_project_category table only if the table exist already.
    if (apiProjectCategoryTableExists) {
      await queryInterface.dropTable("api_project_category");
    };
  } catch (err) {
    console.log(err);
  };
};
