const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verify = require("./verify_token");
const fs = require('fs');

router.get("/:name", verify, (req, res) => {
    try {
        User.findOne({ userName: req.params.name }, (err, user) => {
            if (err) {
                console.log(err);
                res.status(400).json({ status: 0, message: err });
            }
            console.log(user);
            if (user === null) {
                res.status(404).json({ status: 0, message: "User not found" });
            } else {
                res.status(200).json({ status: 1, data: user });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 0, message: error });
    }
});

router.post("/login", async (req, res) => {
    try {
        let usernameOrEmail = await req.body.usernameOrEmail;
        let password = await req.body.password;
        let user;
        if (usernameOrEmail.includes("@")) {
            user = await User.findOne({ userEmail: usernameOrEmail, userPassword: password });
        } else {
            user = await User.findOne({ userName: usernameOrEmail, userPassword: password });
        }
        if (user === null) {
            res.status(404).json({ status: 0, message: "User not found" });
        } else
            jwt.sign({ user }, process.env.TOKEN_SECRET, (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ status: 0, message: err });
                }
                res.header('auth-token', token).status(200).json({ status: 1, message: "User is logged in" });
            });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 0, message: error });
    }
});

router.post("/create", async (req, res) => {
    try {
        let a1, a2;
        a1 = await User.findOne({ userEmail: req.body.userEmail });
        a2 = await User.findOne({ userName: req.body.userName });

        if (a1 !== null) {
            res.status(400).json({
                status: 0,
                message: "User alredy exists please use a different email",
            });
        } else if (a2 !== null) {
            res.status(400).json({
                status: 0,
                message: "User alredy exists please use a different username",
            });
        } else {
            // let base64Data = req.body.userPhoto.replace(/^data:image\/png;base64,/, "");

            // if (!fs.existsSync('../images')) {
            //     await fs.mkdir('../images', (err) => {
            //         if (err) {
            //             console.log(err);
            //         } else console.log("Directory created");
            //     });
            //     await fs.writeFile(`../images/${req.body.userName}.png`, base64Data, 'base64', (err) => {
            //         if (err) {
            //             console.log(err);
            //         } else console.log("The file was saved!");
            //     });
            // } else {
            //     await fs.writeFile(`../images/${req.body.userName}.png`, base64Data, 'base64', (err) => {
            //         if (err) {
            //             console.log(err);
            //         } else console.log("The file was saved!");
            //     });
            // }
            req.body.userPhoto = `https://festify-iiitl.herokuapp.com/images/${req.body.userName}.png`;
            await User.create(req.body, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({ status: 0, message: err });
                }
                console.log(user);
                res.status(200).json({ status: 1, message: "user is successfully created " });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 0, message: error });
    }
});

module.exports = router;
