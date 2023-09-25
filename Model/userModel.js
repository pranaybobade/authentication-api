const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: [true, 'Please enter First Name'],
      trim: true,
      minLength: [2, 'Please enter at least 2 characters'],
    },
    LastName: {
      type: String,
      required: [true, 'Please enter Last Name'],
      trim: true,
      minLength: [2, 'Please enter at least 2 characters'],
    },
    Email: {
      type: String,
      required: [true, 'Please enter Email'],
      trim: true,
    },
    Phone: {
      type: String,
      required: [true, 'Please enter phone number']
    },
    UserName: {
      type: String,
      required: [true, 'Please enter username'],
      trim: true
    },
    Password: {
      type: String,
      required: [true, 'Please enter Password'],
      trim: true,
    },
  },
  { timestamps: true }
);

const user = mongoose.model('User', UserSchema);

module.exports = user;
