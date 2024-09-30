"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating product table");

      // Defining whether the product table already exist or not.
      const productTableExists = await queryInterface.tableExists("product");

      // Condition for creating the product table only if the table doesn't exist already.
      if (!productTableExists) {
        await queryInterface.createTable("product", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          sku: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          name: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
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

          max_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          min_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shopify_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          taxable: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          shopify_product_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },

          brand_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          category_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },

          tax_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          tag_id: {
            type: Sequelize.INTEGER,
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
          allow_sell_out_of_stock: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          virtual_quantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          charge_taxes: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shopify_out_of_stock: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          shopify_price: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          seo_title: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          seo_keyword: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          seo_description: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          allow_transfer_out_of_stock: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          vendor_url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          hsn_code: {
            type: Sequelize.INTEGER,
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
          igst_percentage: {
            type: Sequelize.DECIMAL,
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
          max_stock_days: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          min_stock_days: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          discount_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
          margin_percentage: {
            type: Sequelize.DECIMAL,
            allowNull: true,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the product table already exist or not.
      const productTableExists = await queryInterface.tableExists("product");

      // Condition for dropping the product table only if the table exist already.
      if (productTableExists) {
        await queryInterface.dropTable("product");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
