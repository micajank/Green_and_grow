'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_plan = sequelize.define('user_plan', {
    userId: DataTypes.INTEGER,
    planId: DataTypes.INTEGER
  }, {});
  user_plan.associate = function(models) {
    // associations can be defined here
  };
  return user_plan;
};