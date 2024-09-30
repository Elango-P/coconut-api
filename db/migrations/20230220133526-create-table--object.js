"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating object table");

    // Defining whether the object table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("object");

    // Condition for creating the object table only if the table doesn't exist already.
    if (!purchaseOrderProductTableExists) {
      await queryInterface.createTable("object", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
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
      });
    };
  } catch (err) {
    console.log(err);
  };

};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the object table already exist or not.
    const purchaseOrderProductTableExists = await queryInterface.tableExists("object");

    // Condition for dropping the object table only if the table exist already.
    if (purchaseOrderProductTableExists) {
      await queryInterface.dropTable("object");
    };
  } catch (err) {
    console.log(err);
  };
};
