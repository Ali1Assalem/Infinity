const router = require("express").Router()
const {getAllUsersCtrl , getUserProfileCtrl, updateUserProfileCtrl, profilePhotoUploadCtrl} = require("../controllers/usersController")
const {verifyTokenAndAdmin, verifyTokenAndUser, verifyToken} = require("../middlewares/verifyToken")
const validateObjectId = require("../middlewares/validateObjectId")
const photoUpload = require("../middlewares/photoUpload")
const multerErrorHandler = require("../middlewares/multerErrorHandler")


// /api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl)

// /api/users/profile/:id
router.route("/profile/:id")  
    .get(validateObjectId ,getUserProfileCtrl)
    .put(validateObjectId , verifyTokenAndUser , updateUserProfileCtrl)

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
      .post(verifyToken, photoUpload.single("image"),multerErrorHandler ,profilePhotoUploadCtrl)

module.exports = router