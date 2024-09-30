
module.exports = (sequelize, DataTypes) => {
  
  
    const attendanceType = sequelize.define(
        "attendance_type",
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
              status: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              type: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
              days_count: {
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
              cutoff_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              maximum_leave_allowed: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
              allow_late_checkin: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
              },
        },
        {
            tableName: "attendance_type",
            timestamps: true,
            paranoid: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            deletedAt: "deletedAt"
        }
    );
   
  
   
    return attendanceType;
};
