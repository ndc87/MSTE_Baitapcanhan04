require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const checkUser = async () => {
  await connectDB();
  const user = await User.findOne({ email: 'admin@uteshop.vn' });
  if (user) {
    console.log('User Found:');
    console.log('- Email:', user.email);
    console.log('- Failed Attempts:', user.failed_login_attempts);
    console.log('- Lockout Until:', user.lockout_until);
    console.log('- Role:', user.role);
    console.log('- Password Length:', user.password.length);
  } else {
    console.log('Admin user not found!');
  }
  process.exit();
};

checkUser();
