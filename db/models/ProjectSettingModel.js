module.exports = (sequelize, DataTypes) => {

  const ProjectSetting = sequelize.define(
    'project_setting',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      value: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
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
    },
    {
      tableName: 'project_setting',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      paranoid: true,
    }
  );

  return ProjectSetting;
};
