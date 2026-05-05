// Load environment variables first
require('dotenv').config();

const connection = require("./src/config/db.config");
const { initScheduler } = require('./src/utils/scheduler');

connection();

// Start background tasks
initScheduler();

const app =  require('./app');
