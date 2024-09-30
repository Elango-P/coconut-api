exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating contact_us table");

    // Defining whether the contact_us table already exist or not.
    const contactUsTableExists = await queryInterface.tableExists("contact_us");

    // Condition for creating the contact_us table only if the table doesn't exist already.
    if (!contactUsTableExists) {
      await queryInterface.createTable("contact_us", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        full_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        subject: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        company_id: {
          type: Sequelize.INTEGER,
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
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the contact_us table already exist or not.
    const contactUsTableExists = await queryInterface.tableExists("contact_us");

    // Condition for dropping the contact_us table only if the table exist already.
    if (contactUsTableExists) {
      await queryInterface.dropTable("contact_us");
    };
  } catch (err) {
    console.log(err);
  };
};
