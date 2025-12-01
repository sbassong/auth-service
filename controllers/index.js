const User = require("../models");
const { hashPassword, comparePassword, createToken } = require("../middleware");

const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let passwordDigest = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      passwordDigest,
    });

    res.send({email: user.email, username: user.username, id: user._id});
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .send({ status: "Error", msg: "Email already exists!" });
    }
    throw error;
  }
};

const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await comparePassword(user.passwordDigest, password))) {
      let payload = {
        id: user._id,
        email: user.email,
        username: user.username,
      };

      let token = createToken(payload);

      return res.send({ user: payload, token });
    }

    res.status(401).send({ status: "Error", msg: "Unauthorized" });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  Signup,
  Signin,
};
