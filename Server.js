require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./authRoutes');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const Student = require('./models/studentFormDatas');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const appKey = process.env.JWT_SECRET;


//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());





// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});



// Endpoint to send emails
app.post('/api/send-email', async (req, res) => {
  const { to, subject, message, resultLink } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to:to,
    subject:subject,
    html: `<p>${message}</p><p>Result Link: <a href="${resultLink}">${resultLink}</a></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
    res.status(200).json({ success: 'Email sent successfully', details: info });
  
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email', details: error });
    
  }
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on PORT ${PORT} and connected to DB`);
    });
  })
  .catch((error) => {
    console.log(error);
  });






// Include the authentication routes
app.use('/auth', authRoutes);







// Serving the frontend
app.use(express.static(path.join(__dirname,'/build')));
app.use(express.static(path.join(__dirname, './ictexam-reg/build')));










// Endpoint to handle form data submission
app.post('/api/students',async (req, res) => {
  try {
    console.log('Received data:', req.body); 
    // Extract data from req.body
    const { name, phoneNumber, email, dob, batchName, gender } = req.body;


   



// Create a new student instance using the Mongoose model
    const student = new Student({
      name,
      phoneNumber,
      email,
      dob,
      batchName,
      gender
    });

    // Save the student to the database
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Endpoint to fetch students based on batchName
app.get('/api/students/:batchName',  async (req, res) => {
  try {
    const { batchName } = req.params;

    // Fetch students based on batchName
    const students = await Student.find({ batchName });
    if (students.length === 0) {
      res.status(404).send({ message: 'No students found for the specified batch.' });
    } else {
      res.status(200).send(students);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});




//test-code
app.post('/api/test-student', async (req, res) => {
  try {
    const testStudent = new Student({
      name: 'Test Student',
      phoneNumber: '1234567890',
      email: 'test@example.com',
      dob: '2000-01-01',
      batchName: 'Sample Batch',
      gender: 'male'
    });

    const savedStudent = await testStudent.save();
    res.status(201).send(savedStudent);
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = app;
