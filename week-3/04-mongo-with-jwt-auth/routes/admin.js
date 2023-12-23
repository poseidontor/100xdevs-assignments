const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const { Admin, User, Course } = require('../db/index')

const jwtPassword = '1234567';

const saltRounds = 1;
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    let username = req.body.username;
    let password = req.body.password;


    

    let isRegistered = await Admin.findOne({
        username: username
    })

    if(isRegistered){
        res.status(403).json({
            message: "User already registered"
        })
        return;
    }

    let hashPassword = await bcrypt.hash(password, saltRounds);

    new Admin({
        username: username,
        password: hashPassword
    }).save().then(() => {
        res.status(200).json({
            message: "Admin created successfully"
        })
    }).catch((error) => {
        console.log(`Error inserting admin user: ${error}`);
    })
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic

    let username = req.body.username;
    let password = req.body.password;

    

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

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    const title = req.body.title; 
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    new Course({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink
    }).save().then( (savedCourse) => {
        res.status(200).json({
            message: "Course created successfully",
            CourseId: savedCourse._id
        })
    }).catch( error => {
        console.log(`Error creating new course: ${error}`);
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    let courses = await Course.find({});

    res.status(200).json({
        courses: courses
    })
});

module.exports = router;