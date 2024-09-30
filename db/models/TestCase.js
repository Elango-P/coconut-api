module.exports = (sequelize, DataTypes) => {

    const TestCase = sequelize.define(
      "test_case",
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          test_scenario: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          test_steps: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          prerequisites: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          test_data: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          expected_result: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          createdAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: DataTypes.DATE,
          },
          test_number:{
            allowNull:true,
            type: DataTypes.STRING,
          }
      },
      {
        tableName: "test_case",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
      }
    );

  
    return TestCase;
  };
  