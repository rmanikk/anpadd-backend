import userModel from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        message: "please fill all the required field",
        success: false,
      });
    }

    const checkexistuser = await userModel.findOne({ email });

    if (!checkexistuser) {
      return res.send({ message: "user does not exist", success: false });
    }

    const checkpassword = await bcrypt.compare(
      password,
      checkexistuser.password
    );

    if (!checkpassword) {
      return res.send({ message: "password is incorrect", success: false });
    }

    const token = jwt.sign(
      { id: checkexistuser._id },
      process.env.TOKEN_SECRET
    );

    if (!token) {
      return res.send({ message: "token is not created", success: false });
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send({ message: "user login successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message, success: false });
  }
};

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.send({
        message: "please fill all the required field",
        success: false,
      });
    }

    const checkexistuser = await userModel.findOne({ email });

    if (checkexistuser) {
      return res.send({ message: "user already exist", success: false });
    }

    const salt = await bcrypt.genSalt(10);

    const hashpassword = await bcrypt.hash(password, salt);

    const newuser = new userModel({
      name,
      email,
      password: hashpassword,
    });

    await newuser.save();

    const token = jwt.sign(
      { _id: newuser._id },
      process.env.TOKEN_SECRET
    );

    console.log(token);

    if (!token) {
      return res.send({ message: "token is not created", success: false });
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send({ message: "user created successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.send({ message: error.message, success: false });
  }
};