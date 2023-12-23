const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const { Admin, Course } = require('../db/index')
const router = Router();

const saltRounds = 1;


// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    let username = req.body.username;
    let password = req.body.password;


    let hashPassword = await bcrypt.hash(password, saltRounds);

    let isRegistered = await Admin.findOne({
        username: username
    })

    if(isRegistered){
        res.status(403).json({
            message: "User already registered"
        })
        return;
    }

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