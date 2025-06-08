const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const {User , validationRegisterUser , validationLoginUser} = require("../models/User")

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * @desc     Registr New User 
 * @router   /api/auth/register
 * @methode  POST
 * @access   public
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

 module.exports.registerUserCtrl = async (req, res) => {
    try {
      const { error } = validationRegisterUser(req.body);
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
  

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Login User 
  * @router   /api/auth/login
  * @methode  POST
  * @access   public
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.loginUserCtrl = async (req, res) => {
    try {
      const { error } = validationLoginUser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
  
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: "invalid email or password" });
      }

        
      const isPasswordMatch = await bcrypt.compare(req.body.password,user.password)
      if(!isPasswordMatch){
        return res.status(400).json({ message: "invalid email or password" });
      }
 
      const token = user.generateAuthToken()
  
      return res.status(200).json({ 
        _id: user._id,
        username:user.username,
        email:user.email,
        bio:user.bio,
        isAdmin:user.isAdmin,
        profilePhoto: user.profilePhoto,
        token:token
    });
  
    } catch (err) {
      console.error("Unexpected error in registerUserCtrl:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  