"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating rating table");

    // Defining whether the rating table already exist or not.
    const OrderTypeExist = await queryInterface.tableExists("rating");

    // Condition for creating the rating table only if the table doesn't exist already.
    if (!OrderTypeExist) {
      await queryInterface.createTable("rating", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        account_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        rating_tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        rating: {
          type: Sequelize.DECIMAL,
          allowNull: true
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdAt: {
          allowNull: true,
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
    // Defining whether the rating table already exist or not.
    const OrderTypeExist = await queryInterface.tableExists("rating");

    // Condition for dropping the rating table only if the table exist already.
    if (OrderTypeExist) {
      await queryInterface.dropTable("rating");
    };
  } catch (err) {
    console.log(err);
  };
};
