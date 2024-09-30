'use strict';

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating contact table');

    // Defining whether the contact table already exist or not.
    const contactTableExists = await queryInterface.tableExists('contact');

    // Condition for creating the contact table only if the table doesn't exist already.
    if (!contactTableExists) {
      await queryInterface.createTable('contact', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        mobile: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        designation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        work_phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: true,
            type: Sequelize.DATE
        },
        deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
        }
      ,
        object_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        object_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the contact table already exist or not.
    const contactTableExists = await queryInterface.tableExists('contact');

    // Condition for dropping the contact table only if the table exist already.
    if (contactTableExists) {
      await queryInterface.dropTable('contact');
    }
  } catch (err) {
    console.log(err);
  }
};
