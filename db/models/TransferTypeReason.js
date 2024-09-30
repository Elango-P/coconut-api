
module.exports = (sequelize, DataTypes) => {
    const TransferTypeReason = sequelize.define(
        "transfer_type_reason",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
              },
              name: {
                type: DataTypes.STRING,
                allowNull: true,
              },
              transfer_type: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              created_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              updated_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
              deleted_at: {
                allowNull: true,
                type: DataTypes.DATE,
              },
        },
        {
            tableName: "transfer_type_reason",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: false,
        }
    );
   
    return TransferTypeReason;
};
