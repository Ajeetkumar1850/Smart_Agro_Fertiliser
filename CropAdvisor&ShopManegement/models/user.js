// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   displayName: String,
//   email: String,
//   photo: String,
//   role: {
//     type: String,
//     enum: ['admin', 'user'],
//     default: 'user'
// }
// });
// module.exports = mongoose.model('User', userSchema);                                                            


const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  photo: String,
  role: {
    type: String,
    enum: ['admin', 'user'], // Both roles defined
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);