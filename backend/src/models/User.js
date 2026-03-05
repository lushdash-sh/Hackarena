const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  trustScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 1000 },
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalSaved: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00,
  },
  lastScoreUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
