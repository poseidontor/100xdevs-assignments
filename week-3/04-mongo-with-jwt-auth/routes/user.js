const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { Admin, User, Course } = require('../db/index')

const jwtPassword = '1234567';

const saltRounds = 1;
const router = Router();


// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic

    let username = req.body.username;
    let password = req.body.password;



    let isRegistered = await User.findOne({
        username: username
    })

    if(isRegistered){
        res.status(403).json({
            message: "User already registered"
        })
        return;
    }

    let hashPassword = await bcrypt.hash(password, saltRounds);

    new User({
        username: username,
        password: hashPassword
    }).save().then(() => {
        res.status(200).json({
            message: "User created successfully"
        })
    }).catch((error) => {
        console.log(`Error inserting admin user: ${error}`);
    })

});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    // Implement admin signup logic

    let username = req.body.username;
    let password = req.body.password;

    

    User.findOne({username: username}).then((result,err) => {
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

            const payload = {
                username: username,
            }
            let token = jwt.sign(payload, jwtPassword);

            res.status(200).json({
                token: token
            })
        })
        
    })
});

router.get('/courses', userMiddleware, async (req, res) => {
    // Implement listing all courses logic

    let courses = await Course.find({});

    res.status(200).json({
        courses: courses
    })

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic

    let courseId = req.params.courseId;
    console.log(courseId);
    let course = await Course.findOne({
        _id: courseId
    });

    if(!course) {
        res.status(404).json({
            message: "Course not found"
        })
        return;
    }

    let tokenHeader = req.headers.authorization;

    const token = tokenHeader.substring(7);
    let payload = jwt.decode(token);
    let user = await User.findOne({username: payload.username});
    let userCourses = user.coursepurchased;

    userCourses.push(course._id);
    
    user.coursepurchased = userCourses;

    user.save().then(() => {
        res.status(200).json({
            message: "Course purchased successfully"
        })
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic

    let tokenHeader = req.headers.authorization;

    const token = tokenHeader.substring(7);
    let payload = jwt.decode(token);
    let user = await User.findOne({username: payload.username});

    let courses = await Course.find({_id: {$in: user.coursepurchased}})

    res.status(200).json({
        purchasedCourses: courses
    })
});

module.exports = router