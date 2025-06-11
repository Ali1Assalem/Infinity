const {User} = require("../models/User")





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
  