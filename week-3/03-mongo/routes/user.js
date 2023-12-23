const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const {Admin, User, Course} = require('../db/index')
const userMiddleware = require("../middleware/user");

let saltRounds = 1;

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    let username = req.body.username;
    let password = req.body.password;


    let hashPassword = await bcrypt.hash(password, saltRounds);

    let isRegistered = await User.findOne({
        username: username
    })

    if(isRegistered){
        res.status(403).json({
            message: "User already registered"
        })
        return;
    }

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

    let user = await User.findOne({username: req.headers.username});
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

    let user = await User.findOne({username: req.headers.username});

    let courses = await Course.find({_id: {$in: user.coursepurchased}})

    res.status(200).json({
        purchasedCourses: courses
    })


});

module.exports = router