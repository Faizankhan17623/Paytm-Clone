const jwt = require('jsonwebtoken')
exports.Auth = (req,res,next)=>{
    try {
        const token = req.cookies.token || req.body.token || req.headers('Authorization').replace("Bearer "," ");
        if(!token){
            res.status(404).json({
                message:"The token is not presetn",
                success:false
            })
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decode
        console.log("THis is the decode",decode)
        next()
    } catch (error) {
        return res.status(500).json({
            message:"There is som ekind of the error",
            success:false
        })
    }
}