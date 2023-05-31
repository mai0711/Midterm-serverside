const router = require("express").Router();
const { request } = require("express");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req,res) => {
    try{
        //generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and respond
        const user = await newUser.save();//save data in Database
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Login
router.post("/login", async(req, res) => {
    try{
        //check email
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found")// wrong email
        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")// wrong password

        res.status(200).json(user)//email and password are correct
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router