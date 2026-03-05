require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize } = require('./database');
require('../models'); // Loads models and associations

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to sync database:', error.message);
    process.exit(1);
  }
})();
