const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  console.log(user, "useruser")
  return jwt.sign(
    { id: user._id, username: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
