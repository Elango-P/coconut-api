module.exports = (sequelize, DataTypes) => {
  const Tag = require("./Tag")(sequelize, DataTypes);

  const Rating = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating_tag_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
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
    company_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  };
  const rating = sequelize.define("rating", Rating, {
    tableName: "rating",
    sequelize,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  });

  rating.belongsTo(Tag, {
    as: "typeData",
    foreignKey: "rating_tag_id",
  });
  return rating;
};
