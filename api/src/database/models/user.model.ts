const User = (sequelize: any, DataTypes: any) => {
  const User = sequelize.define(
    'user',
    {
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};

module.exports = User;
