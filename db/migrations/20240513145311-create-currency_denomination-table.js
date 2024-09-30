'use strict';

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating currency_denomination table');

    // Defining whether the currency_denomination table already exist or not.
    const tableDefinatiuon = await queryInterface.tableExists('currency_denomination');

    // Condition for creating the currency_denomination table only if the table doesn't exist already.
    if (!tableDefinatiuon) {
      await queryInterface.createTable('currency_denomination', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        denomination: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        count: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
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
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the currency_denomination table already exist or not.
    const tableDefinatiuon = await queryInterface.tableExists('currency_denomination');

    // Condition for dropping the currency_denomination table only if the table exist already.
    if (tableDefinatiuon) {
      await queryInterface.dropTable('currency_denomination');
    }
  } catch (err) {
    console.log(err);
  }
};
