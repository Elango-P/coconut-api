'use strict';

exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating bill table');

    // Defining whether the bill table already exist or not.
    const billTableExists = await queryInterface.tableExists('bill');

    // Condition for creating the bill table only if the table doesn't exist already.
    if (!billTableExists) {
      await queryInterface.createTable('bill', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        bill_date: {
          type: Sequelize.DATEONLY,
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
        account_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        billing_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        invoice_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        net_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        cgst_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        sgst_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        cess_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        igst_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        gst_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        bill_number: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        gst_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        cash_discount_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        other_deduction_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        invoice_amount: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        cash_discount_percentage: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        notes: {
          allowNull: true,
          type: Sequelize.TEXT,
        },
        created_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        owner_id: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        due_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        returned_items_amount: {
          type: Sequelize.NUMERIC,
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
    // Defining whether the bill table already exist or not.
    const billTableExists = await queryInterface.tableExists('bill');

    // Condition for dropping the bill table only if the table exist already.
    if (billTableExists) {
      await queryInterface.dropTable('bill');
    }
  } catch (err) {
    console.log(err);
  }
};
