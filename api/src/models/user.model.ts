const user = (sequelize: any, Sequelize: any) => {
  const User = sequelize.define('users', {
    password: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  return User;
};

module.exports = user;
