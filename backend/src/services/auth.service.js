const { hashPassword, comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const User = require("../models/User");

const register = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    role: "user",
  });
  
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    id: user._id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  register,
  login,
};
