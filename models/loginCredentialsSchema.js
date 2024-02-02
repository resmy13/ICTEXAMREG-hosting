// models/loginCredentialsSchema.js
const mongoose = require('mongoose');

const loginCredentialsSchema = new mongoose.Schema({
  userType: String,
  email: String,
  password: String
});

const LoginCredentials = mongoose.model('logincredentials', loginCredentialsSchema);

module.exports = LoginCredentials;
