const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const {User , validatiionRegisterUser} = require("../models/User")

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * @desc     Registr New User 
 * @router   /api/auth/register
 * @methode  POST
 * @access   public
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

 module.exports.registerUserCtrl = async (req, res) => {
    try {
      const { error } = validatiionRegisterUser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
  
      await user.save();
  
      return res.status(201).json({ message: "User registered successfully, please log in" });
  
    } catch (err) {
      console.error("Unexpected error in registerUserCtrl:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  