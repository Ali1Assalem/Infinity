const jwt = require("jsonwebtoken")


function verifyToken(req,res,next){
    const authToken = req.headers.authorization
    if(authToken){
        const token = authToken.split(" ")[1]
        try{
            const decodedPayload = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decodedPayload
            next()
        }catch(error){
            return res.status(401).json({ message: "Invalid token, access denied" });
        }
    }else{
        return res.status(401).json({ message: "no token provided, access denied" });
    }

}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        try {
            if (req.user && req.user.isAdmin) {
                next();
            } else {
                return res.status(403).json({ message: "Not allowed, admin only" });
            }
        } catch (err) {
            console.error("Error in verifyTokenAndAdmin:", err);
            return res.status(500).json({ message: "server internal error" });
        }
    });
}


function verifyTokenAndUser(req, res, next) {
    verifyToken(req, res, () => {
        try {
                            console.log(req.user._id +' '+req.params.id);

            if (req.user.id === req.params.id) {                
                next();
            } else {
                return res.status(403).json({ message: "Not allowed, only user himself" });
            }
        } catch (err) {
            console.error("Error in verifyTokenAndUser:", err);
            return res.status(500).json({ message: "server internal error" });
        }
    });
}


module.exports = {verifyToken , verifyTokenAndAdmin ,verifyTokenAndUser}