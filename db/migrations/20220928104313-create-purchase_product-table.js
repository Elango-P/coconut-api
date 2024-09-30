'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating purchase_product table");

      // Defining whether the purchase_product table already exist or not.
      const purchaseProductTableExists = await queryInterface.tableExists("purchase_product");

      // Condition for creating the purchase_product table only if the table doesn't exist already.
      if (!purchaseProductTableExists) {
        await queryInterface.createTable("purchase_product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          purchase_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          quantity: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          unit_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },

          discount_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          discount_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          tax_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          tax_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          net_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          }, 
          vendor_id: {
            type: Sequelize.INTEGER, 
            allowNull: true,
          },
          cgst_percentage: {
            type: Sequelize.DECIMAL, 
            allowNull: true,
          },
          sgst_percentage: {
            type: Sequelize.DECIMAL, 
            allowNull: true,
          },
          cess_percentage: {
            type: Sequelize.DECIMAL, 
            allowNull: true,
          },
          cgst_amount: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          sgst_amount: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          cess_amount: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          igst_amount: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          mrp: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
           margin_amount: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          igst_percentage: {
            type: Sequelize.NUMERIC, 
            allowNull: true,
          },
          manufactured_date: {
            type:Sequelize.DATE, 
            allowNull: true,
          },
          mrp: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          margin_percentage: {
            type: Sequelize.NUMERIC,
            allowNull: true,
          },
          discount_percentage: {
            type: Sequelize.DECIMAL, 
            allowNull: true,
          },
          barcode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the purchase_product table already exist or not.
      const purchaseProductTableExists = await queryInterface.tableExists("purchase_product");

      // Condition for dropping the purchase_product table only if the table exist already.
      if (purchaseProductTableExists) {
        await queryInterface.dropTable("purchase_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
