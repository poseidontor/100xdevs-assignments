const {Admin, User, Course} = require("../db/index")
const bcrypt = require("bcrypt")



// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    let username = req.headers.username;
    let password = req.headers.password;


    Admin.findOne({username: username}).then((result,err) => {
        if(!result) {
            res.status(404).json({
                message: "User not found. Please register."
            })
            return;
        }
        bcrypt.compare(password, result.password).then(valid => {
            if(!valid){
                res.sendStatus(403);
                return;
            }
            next();
        })
        
    })



}

module.exports = adminMiddleware;