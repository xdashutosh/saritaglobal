import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

import User from '../../models/user.model.js'

dotenv.config()

let transport = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const register = async (req, res) => {

  const { email, password, name } = req.body;

  const currentUser = await User.findOne({ email: email });

  if (currentUser) {
    return res.status(200).json({
      userAlreadyExists: true,
      userCreated: false
    });
  }

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashedpassword,
      name: name
    });

    newUser.save();

    res.status(200).json({
      userCreated: true,
    });

    console.log("user with " + req.body.email + " created!!")
  } catch (err) {
    res.status(500).json({
      userCreated: false,
    });
    console.error(err)
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user === null) {
    return res.status(400).json({
      userExists: false,
    });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {

      const params = {
        uid: user._id.toString(),
      };

      const newAccessToken = jwt.sign(params, process.env.SECRET);

      res.cookie("accessToken", newAccessToken, { maxAge: 900000  });
      let isUser = true;
      if(user.role != "user")
      {
        isUser = false;
      }
      res.status(200).json({
        loggedIn: true,
        isUser: isUser

      });
    } else {
      console.log("User creds wrong");
      res.status(401).json({
        wrongCred: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      userExists: false,
    });
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(204).json({
      userFound: false
    })
  }

  try {

    const params = {
      uid: user._id.toString(),
    };

    const passwordToken = jwt.sign(params, process.env.SECRET);

    await transport
      .sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Confirmation email from Sarita Global",
        html: `<p>Click the below link to reset your password</p><br />https://saritaglobalfrontend.vercel.app/change-password/${passwordToken}`,
      })
      .then(() => {
        console.log('email sent!');
      });

    res.status(200).json({
      userFound: true,
      // passwordToken: passwordToken //  send it ashu boi if u want to, but there is no need of doing so
    })

    // mail user to click this link
    //  http://localhost:5000/0auth/changePass/theTokenAbove
  } catch (err) {
    console.error(err);
    res.status(500).json({
      userFound: false
    })
  }
}

export const changePassword = async (req, res) => {
  const { passwordToken } = req.params;
  const { newPassword } = req.body;
  
  console.log(passwordToken,newPassword);

  const payload = jwt.verify(passwordToken, process.env.SECRET);

  if (!payload) {
    return res.status(400).json({
      passwordChanged: false,
      tokenValid: false
    })
  }

  const userId = payload.uid;
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await User.updateOne({ _id: userId }, { password: newHashedPassword });

    res.status(200).json({
      passwordChanged: true,
      tokenValid: true
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
      passwordChanged: false,
      tokenValid: false
    })
  }
}

export const logout = async (req, res) => {

}