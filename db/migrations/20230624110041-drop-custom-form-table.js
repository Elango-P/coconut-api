// Change week_days DataType
exports.up = function up(queryInterface, Sequelize) {
  console.log("Drop Table: custom form");
  return queryInterface.dropTable("custom_form");
};

exports.down = async function down(queryInterface) {
  try {
    console.log("Create Table: custom_form");

    await queryInterface.createTable("custom_form", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
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
};
