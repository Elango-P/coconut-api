'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Creating order_product_index table");
      return queryInterface.dropTable("order_product_index", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        order_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        order_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        order_product_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        store_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        store_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        unit_price: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        price: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        shift: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        order_number: {
          type: Sequelize.BIGINT,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: true,

        },
        status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        quantity: {
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
    } catch (err) {
      console.log(err);
    }
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.createTable("order_product_index");
  }
};

