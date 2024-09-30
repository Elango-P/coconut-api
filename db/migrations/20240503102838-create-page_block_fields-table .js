'use strict';

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating page_block_fields table');

    // Defining whether the page_block_fields table already exist or not.
    const tableDefinatiuon = await queryInterface.tableExists('page_block_fields');

    // Condition for creating the page_block_fields table only if the table doesn't exist already.
    if (!tableDefinatiuon) {
      await queryInterface.createTable('page_block_fields', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        page_block_id:{
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        media_id:{
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
    // Defining whether the page_block_fields table already exist or not.
    const tableDefinatiuon = await queryInterface.tableExists('page_block_fields');

    // Condition for dropping the page_block_fields table only if the table exist already.
    if (tableDefinatiuon) {
      await queryInterface.dropTable('page_block_fields');
    }
  } catch (err) {
    console.log(err);
  }
};