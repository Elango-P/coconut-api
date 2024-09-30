'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product_index table");

      // Defining whether the product_index table already exist or not.
      const productIndexTableExists = await queryInterface.tableExists("product_index");

      // Condition for creating the product_index table only if the table doesn't exist already.
      if (!productIndexTableExists) {
        await queryInterface.createTable("product_index", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          product_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          product_name: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          brand_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          size: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          unit: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          product_display_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          product_media_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          brand_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          category_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          category_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          cost: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          sale_price: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          mrp: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
          featured_media_url: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          max_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          min_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          allow_transfer_out_of_stock: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
       
          profit_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          profit_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          allow_sell_out_of_stock: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          tax_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          pack_size: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          track_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          print_name: {
            type: Sequelize.STRING,
            allowNull: true
          },
          product_price_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          manufacture_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          manufacture_name: {
            type: Sequelize.STRING,
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
          cgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          sgst_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          last_purchased_cost: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          last_purchased_date:{
            type: Sequelize.DATE,
            allowNull: true,
        },
        discount_percentage:{
          type: Sequelize.DECIMAL,
          allowNull: true,
      },
      margin_percentage: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      igst_percentage: {
        type: Sequelize.DECIMAL,
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
      // Defining whether the product_index table already exist or not.
      const productIndexTableExists = await queryInterface.tableExists("product_index");

      // Condition for dropping the product_index table only if the table exist already.
      if (productIndexTableExists) {
        await queryInterface.dropTable("product_index");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
