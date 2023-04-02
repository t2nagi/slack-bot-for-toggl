'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToggl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserToggl.init({
    user_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    channel: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserToggl',
  });
  return UserToggl;
};