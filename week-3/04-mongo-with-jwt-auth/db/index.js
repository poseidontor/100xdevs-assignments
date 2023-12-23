const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://testknoxapp:Qwerty1234@cluster0.ptz827p.mongodb.net/');

// Define schemas
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    coursepurchased: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: {type: Boolean, default: false}
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}