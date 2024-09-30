'use strict';

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating address table');

    // Defining whether the address table already exist or not.
    const addressTableExists = await queryInterface.tableExists('address');

    // Condition for creating the address table only if the table doesn't exist already.
    if (!addressTableExists) {
      await queryInterface.createTable('address', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address2: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        pin_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        gst_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
        title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        longitude: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        latitude: {
          type: Sequelize.STRING,
          allowNull: true,
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the address table already exist or not.
    const addressTableExists = await queryInterface.tableExists('address');

    // Condition for dropping the address table only if the table exist already.
    if (addressTableExists) {
      await queryInterface.dropTable('address');
    }
  } catch (err) {
    console.log(err);
  }
};
