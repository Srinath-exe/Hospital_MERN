const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const bcryp = require('bcryptjs');
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middlewares/authMiddlewares")

router.post('/register', async (req, res) => {

    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(200).send({
                message: "User Already Exist",
                success: false
            });
        }

        // const password = req.body.password;
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json({
            message: "User Created Successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Creating User", success: false })

    }

})

router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({
                message: "User does not Exist", success: false
            });
        }

        var isMatch = false;
        if (req.body.password == user.password) {
            isMatch = true;
        }
        if (isMatch == false) {
            return res.status(200).send({
                message: "Password is Incorrect", success: false
            });
        } else {
            const token = jwt.sign({ id: user._id, }, process.env.JWT_SECRET, {
                expiresIn: "1D"
            })
            res.status(200).
                send({ message: "login Successful", success: true, data: token });
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error logging in", success: false, error });
    }

})

router.post('/get-user-info-by-id', authMiddleware, async (res, req) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(200).send({
                message: "User does not Exist", success: false
            });
        } else {
            res.status(200).
                send({
                    success: true, data: {
                        name: user.name,
                        email: user.email
                    }
                });
        }

    } catch (error) {
        res.status(500).
            send({
                message : "Error getting user Info",
                success: false
            });
    }
})

module.exports = router;