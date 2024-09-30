"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
	  console.log("Creating test_suite_label table");

    // Defining whether the test_suite_label table already exist or not.
    const testSuiteLabelTableExists = await queryInterface.tableExists("test_suite_label");

    // Condition for creating the test_suite_label table only if the table doesn't exist already.
    if (!testSuiteLabelTableExists) {
      await queryInterface.createTable("test_suite_label", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        test_suite_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        label_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        label: {
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
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the test_suite_label table already exist or not.
    const testSuiteLabelTableExists = await queryInterface.tableExists("test_suite_label");

    // Condition for dropping the test_suite_label table only if the table exist already.
    if (testSuiteLabelTableExists) {
      await queryInterface.dropTable("test_suite_label");
    };
  } catch (err) {
    console.log(err);
  };
};
