const user = (sequelize: any, Sequelize: any) => {
  const User = sequelize.define('users', {
    password: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    passwordExpiry: {
      type: Sequelize.DATE,
      unique: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return User;
};

module.exports = user;
