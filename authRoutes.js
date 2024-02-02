// authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const LoginCredentials = require('./models/loginCredentialsSchema');
const appKey = process.env.JWT_SECRET


//function checkToken(req,res,next){
 // try{
 //   const token= req.headers.token;
 //   if(!token) throw new Error('Unauthorized');
 //   let payload=jwt.verify(token,appKey);
 //   let payloadAdmin=jwt.verify(token,appKey);
 //   if(!payload && !payloadAdmin) throw new Error('Unauthorized');
 //   next();
 // }catch(error){
  //  res.status(401).send(error);
 // }
//}















// Authentication endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const payload = {email:email, password:password};
  const payloadAdmin={email:email,password:password};

  try {
    // Find user by email
    const user = await LoginCredentials.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const findUser = await LoginCredentials.findOne({ email, password });

    if (!findUser) {
      return res.status(401).json({ message: 'Invalid password' });
    }else{
      var clientStatus = findUser.userType
      console.log(clientStatus)
      if(clientStatus === 'student'){
        let payload ={ email:email, password:password, clientStatus: clientStatus};
        let token = jwt.sign(payload, appKey);
        res.status(200).send({message:'userlogin', token:token})
      }else if(clientStatus === 'admin'){
        let payloadAdmin ={ email:email, password:password, clientStatus: clientStatus};
        let token = jwt.sign(payloadAdmin, appKey);        
        res.status(200).send({message:'adminlogin', token:token})
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
