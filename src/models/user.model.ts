const user = (sequelize: any, Sequelize: any) => {
  const User = sequelize.define('users', {
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    passwordExpiry: {
      type: Sequelize.DATE,
    },
  });

  return User;
};

module.exports = user;
