const User = require("../models/users");
const bcrypt = require("bcrypt-nodejs");

exports.users_register = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                //Mail Exist in the Database
                return res.status(500).json({
                    success: false,
                    message: "Email ID Already Exist",
                    flag: -1
                });
            } else {
                User.find({
                        mobileNo: req.body.mobileNo
                    })
                    .exec()
                    .then(user => {
                        if (user.length >= 1) {
                            //Mobile No exist in the Database
                            return res.status(500).json({
                                success: false,
                                message: "Mobile Number Already Registered",
                                flag: -2
                            });
                        } else {
                            if (
                                new Date(
                                    new Date().getFullYear(),
                                    new Date().getMonth(),
                                    new Date().getDate() + 1
                                ) > new Date(req.body.licenseValidDate)
                            ) {
                                //License Date expired
                                return res.status(500).json({
                                    success: false,
                                    message: "License Date Expired",
                                    flag: -3
                                });
                            } else {
                                bcrypt.hash(req.body.password, null, null, (err, hash) => {
                                    const user = new User({
                                        name: req.body.name,
                                        gender: req.body.gender,
                                        email: req.body.email,
                                        password: hash,
                                        dob: req.body.dob,
                                        mobileNo: req.body.mobileNo,
                                        licenseNo: req.body.licenseNo,
                                        user_type: req.body.user_type,
                                        licenseValidDate: req.body.licenseValidDate,
                                        address: req.body.address,
                                        city: req.body.city,
                                        state: req.body.state,
                                        ward_no: req.body.ward_no,
                                        vehicle: req.body.vehicle
                                    });
                                    user
                                        .save()
                                        .then(result => {
                                            return res.status(200).json({
                                                success: true,
                                                message: "Registration Successful",
                                                id: result._id,
                                                flag: 1
                                            });
                                        })
                                        .catch(err => {
                                            res.status(500).json({
                                                success: false,
                                                message: "Resource Unavailable At This Moment"
                                            });
                                            console.log(
                                                err +
                                                "\n" +
                                                "Problem in inserting new user in database in api/rest/v1/easeparking/users/register url"
                                            );
                                        });
                                });
                            }
                        }
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "Resource Unavailable At This Moment"
            });
            console.log(
                err +
                "\n" +
                "Problem in fetching data from database in api/rest/v1/easeparking/users/register url"
            );
        });
};

exports.users_login = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(result => {
            if (result.length < 1) {
                //Match Not Found For Email ID
                res.status(500).json({
                    success: false,
                    message: 'User Not Found',
                    flag: -1
                });
            } else {
                bcrypt.compare(req.body.password, result[0].password, (err, ans) => {
                    if (err) {
                        //Password Does Not Match With Email ID
                        return res.status(500).json({
                            success: false,
                            message: 'Authorization Failed',
                        });
                    }
                    if (ans) {
                        return res.status(200).json({
                            success: true,
                            message: 'User Login Successful',
                            flag: 1,
                            data: {
                                user_id: result[0]._id,
                                name: result[0].name,
                                email: result[0].email,
                                user_type: result[0].user_type,
                                active_status: result[0].active_status,
                                vehicle: result[0].vehicle
                            }
                        });
                    }
                    res.status(500).json({
                        success: false,
                        message: 'Password Incorrect',
                        flag: -2
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: "Resource Unavailable At This Moment"
            });
            console.log(
                err +
                "\n" +
                "Problem in fetching data from database in api/rest/v1/easeparking/users/login url"
            );
        });
};