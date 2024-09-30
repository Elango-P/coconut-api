module.exports = (sequelize, DataTypes) => {
  const Project = require("./Project")(sequelize, DataTypes);
  const User = require("./User")(sequelize, DataTypes);
  const TestSuiteLabel = require("./TestSuiteLabel")(sequelize, DataTypes);
  const TestSuite = sequelize.define(
    "TestSuite",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sort: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null,
      },
      modules: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      features: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      types: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimated_hours: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      condition: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "test_suite",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  TestSuite.belongsTo(Project, { as: "project", foreignKey: "project_id" });
  TestSuite.belongsTo(User, { as: "user", foreignKey: "updated_by" });
  TestSuite.hasMany(TestSuiteLabel, {
    as: "testSuiteLabel",
    foreignKey: "test_suite_id",
    primaryKey: "id",
  });
  return TestSuite;
};
