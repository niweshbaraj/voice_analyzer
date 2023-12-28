import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { firstname, lastname, username, email, password, gender } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const newUser = new User({
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    gender,
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return errorHandler(404, "User not found!");
        };
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return errorHandler(401, "Wrong Credentials!");
        };
        const { password: hashedPassword, ...rest } = validUser._doc;
        sendToken(rest, 200, res);
    } catch (error) {
        next(error);
    }
};

const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, expiresIn: "1 hour" },
        process.env.JWT_SECRET,
        {
            expiresIn: "1 hour",
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, expiresIn: "1 hour" },
        process.env.JWT_SECRET,
        {
            expiresIn: "1 hour",
        }
    );
};

const sendToken = (user, statusCode, res) => {
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    res
    .cookie("access_token", token, "refresh_token", refreshToken, {httpOnly: true, expires: expiryDate})
    .status(statusCode).json({
        message: "User logged in successfully!",
        user,
    });
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);
      const username = req.body.name
        .split(" ")
        .join("")
        .toLowerCase()
        .concat(Math.floor(Math.random() * 10000).toString());
      const newUser = new User({
        username: username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// signout

export const signout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Signout successfully!" });
};
