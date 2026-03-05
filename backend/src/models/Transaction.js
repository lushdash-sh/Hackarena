const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  txId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' },
  },
  merchantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  roundedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  savedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM(
      'food', 'entertainment', 'transport',
      'groceries', 'subscriptions', 'education', 'other'
    ),
    defaultValue: 'other',
  },
  roundUpMultiplier: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'The behavioral multiplier applied (e.g., 2x for food, 3x for entertainment)',
  },
}, {
  tableName: 'transactions',
  timestamps: true,
});

// Associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = Transaction;
