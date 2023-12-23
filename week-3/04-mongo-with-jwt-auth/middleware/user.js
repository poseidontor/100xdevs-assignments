const {Admin, User, Course} = require("../db/index")
const jwt = require('jsonwebtoken')

const jwtPassword = "1234567";

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const tokenHeader = req.headers.authorization;

    if(!tokenHeader) {
        res.status(403).json({
            message: "Authorization token missing from the request"
        })

        return;
    }
    if(!tokenHeader.startsWith('Bearer ')){
        res.status(403).json({
            message: "Invalid JWT token"
        })

        return;
    }

    const token = tokenHeader.substring(7);

    jwt.verify(token, jwtPassword, (err, decoded)  => {
        if(err) {
            res.status(403).json({
                message: "Invaild JWT Token"
            })
            return;
        }

        let user = decoded.username;
        //Validating account type (Admin or User)
        User.findOne({username: user}).then((result, err) => {
            if(!result){
                res.status(403).json({
                    message: "Unauthorized"
                })
                return;
            }

            next();
        }) 
    })

}

module.exports = userMiddleware;