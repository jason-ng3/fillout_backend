require('dotenv').config();

const PORT = process.env.PORT;
const API_KEY = process.env.FILLOUT_API_KEY;

module.exports = {
  PORT,
  API_KEY
}