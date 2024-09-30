exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user_employment table");

    // Defining whether the user_employment table already exist or not.
    const userEmploymentTableExists = await queryInterface.tableExists("user_employment");

    // Condition for creating the user_employment table only if the table doesn't exist already.
    if (!userEmploymentTableExists) {
      await queryInterface.createTable("user_employment", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        designation: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        salary: {
          type: Sequelize.NUMERIC,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        primary_location_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        primary_shift_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        secondary_location_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        secondary_shift_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        working_days:{
          type:Sequelize.STRING,
          allowNull:true
      }
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user_employment table already exist or not.
    const userEmploymentTableExists = await queryInterface.tableExists("user_employment");

    // Condition for dropping the user_employment table only if the table exist already.
    if (userEmploymentTableExists) {
      await queryInterface.dropTable("user_employment");
    };
  } catch (err) {
    console.log(err);
  };
};
