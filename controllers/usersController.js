const {User, validateUpdateUser} = require("../models/User")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")
const { cloudinaryUploadImage,cloudinaryRemoveImage } = require("../utils/cloudinary")





/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Get All Users Profile
  * @router   /api/users/profile
  * @methode  GET
  * @access   private (only admin)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.getAllUsersCtrl = async (req, res) => {
    try {
      
      const users = await User.find().select("-password -token").lean();

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      res.status(200).json(users);
  
    } catch (err) {
      console.error("Unexpected error in getAllUsersCtrl:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Get User Profile
  * @router   /api/users/profile/:id
  * @methode  GET
  * @access   Public
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.getUserProfileCtrl = async (req, res) => {
    try {
      
      const user = await User.findById(req.params.id).select("-password -token").lean();

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(200).json(user);
  
    } catch (err) {
      console.error("Unexpected error in getUserProfileCtrl:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Update User Profile
  * @router   /api/users/profile/:id
  * @methode  PUT
  * @access   Private (only user himself)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.updateUserProfileCtrl = async (req, res) => {
    try {
      const { error } = validateUpdateUser(req.body)

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      if(req.body.password){
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password,salt)
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
          username : req.body.username,
          password : req.body.passwod,
          bio : req.body.bio
        }
      },{new:true}).select("-password -token")

      res.status(200).json(updatedUser);
  
    } catch (err) {
      console.error("Unexpected error in updateUserProfileCtrl:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  


  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Profile Photo Upload
  * @router   /api/users/profile/profile-photo-upload
  * @methode  POST
  * @access   Private (only logged in user)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.profilePhotoUploadCtrl = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);

    if (!result || !result.secure_url || !result.public_id) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    try {
      fs.unlinkSync(imagePath);
    } catch (fsErr) {
      console.warn("Failed to delete local image:", fsErr.message);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    user.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    return res.status(200).json({
      message: "Your profile photo uploaded successfully",
      imageUrl: result.secure_url,
    });

  } catch (err) {
    console.error("Unexpected error in profilePhotoUploadCtrl:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  * @desc     Delete User Profile (Account)
  * @router   /api/users/profile/:id
  * @methode  DELETE
  * @access   Private (only admin or user himself)
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  module.exports.deleteUserProfileCtrl = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Your profile has been deleted",
    });

  } catch (err) {
    console.error("Unexpected error in deleteUserProfileCtrl:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
