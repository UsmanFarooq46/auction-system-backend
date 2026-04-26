// Load environment variables first
require('dotenv').config();

const connection = require("./src/config/db.config");

connection();

const app =  require('./app');
