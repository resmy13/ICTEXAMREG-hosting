const mongoose = require('mongoose');

const studentFormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  batchName: { type: String, required: true },
  gender: { type: String, required: true },
});

const studentFormDatas = mongoose.model('studentformdatas', studentFormSchema);

module.exports = studentFormDatas;
