module.exports = (sequelize, DataTypes) => {

    const Training = sequelize.define("training", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          training_name: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          category: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          description: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          banner_image: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          course_file: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          sharing_permission: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          send_notification: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          type: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          link_course_id: {
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
    }, {
        tableName: "training",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
        paranoid: true,
    });

    return Training;
};
