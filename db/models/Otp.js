module.exports = (sequelize, DataTypes) => {

    const Otp = sequelize.define(
      "otp",
      {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          type: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          object_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          object_name: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          code: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          used_at: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          expired_at: {
            type: DataTypes.DATE,
            allowNull: true,
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
      },
      {
        tableName: "otp",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt",
      }
    );

    Otp.addHook('afterCreate', async (otp, options) => {
      /* ✴--- Set a timeout to update expired_at after 1 Hours---✴ */
      setTimeout(async () => {
        /* ✴---Update expired_at to the current time after 1 Hours---✴ */
          await Otp.update(
              { expired_at: new Date() },
              {
                  where: {
                      id: otp.id /* ✴---Update the expired_at column for the created OTP---✴ */
                  }
              }
          );
      }, 7200000); /* ✴---3600000 milliseconds = 1 Hours---✴ */
  });

  
    return Otp;
  };
  