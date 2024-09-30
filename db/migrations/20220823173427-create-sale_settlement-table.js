module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating sale_settlement table");

      // Defining whether the sales table already exist or not.
      const salesTableExists = await queryInterface.tableExists("sale_settlement");

      // Condition for creating the sales table only if the table doesn't exist already.
      if (!salesTableExists) {
        await queryInterface.createTable("sale_settlement", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          date: {
            allowNull: true,
            type: Sequelize.DATEONLY,
          },
          shift: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          type: {
            allowNull: true,
            type: Sequelize.STRING
          },
          amount: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            allowNull: false,
            type: Sequelize.INTEGER,
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
          sale_settlement_number: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          amount_cash: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          amount_upi: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          sales_executive: {
            allowNull: true,
            type: Sequelize.INTEGER
          },
          discrepancy_amount_cash: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          discrepancy_amount_upi: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          notes: {
            allowNull: true,
            type: Sequelize.TEXT,
          },
          calculated_amount_cash: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          calculated_amount_upi: {
            allowNull: true,
            type: Sequelize.DECIMAL
          },
          received_amount_cash: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          received_amount_upi: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          cash_in_store: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          total_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          total_calculated_amount: {
            type : Sequelize.DECIMAL,
            allowNull : true
          },
          total_received_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          total_discrepancy_amount: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
         
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            },
            cash_to_office: {
              type: Sequelize.DECIMAL,
              allowNull: true
            },
            reviewer: {
              type: Sequelize.INTEGER,
              allowNull: true
            },
            due_date: {
              type: Sequelize.DATEONLY,
              allowNull: true
            },
            draft_order_amount: {
              type: Sequelize.DECIMAL,
              allowNull: true
            },
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the sales table already exist or not.
      const salesTableExists = await queryInterface.tableExists("sale_settlement");

      // Condition for dropping the sales table only if the table exist already.
      if (salesTableExists) {
        await queryInterface.dropTable("sale_settlement");
      };
    } catch (err) {
      console.log(err);
    };
  },
};