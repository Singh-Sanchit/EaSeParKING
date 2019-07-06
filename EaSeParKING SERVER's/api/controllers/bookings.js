const Booking = require('../models/bookings');
const Parking = require('../models/parkings');
exports.bookings_addNewBooking = (req, res, next) => {
    const booking = new Booking({
        booking_id: Math.floor(10000000000 + Math.random() * 90000000000),
        start_time: req.body.start_time,
        start_date: req.body.start_date,
        charge: req.body.charge,
        book_status: true,
        vehicleNo: req.body.vehicleNo,
        _pid: req.body.patch_id,
        user_id: req.body.user_id
    });
    Parking
        .find({
            patch_id: req.body.patch_id
        })
        .exec()
        .then(ans => {
            //Check if any patch got matched with the user given patch_id
            if (ans.length === 1) {
                //Check the capacity of freehand and increment the capacity_count by 1
                if (ans[0].capacity - 1 >= ans[0].capacity_count && ans[0].patch_type === 'freehand') {
                    booking._pid = ans[0]._id;
                    Parking
                        .updateOne({
                            patch_id: req.body.patch_id
                        }, {
                            $inc: {
                                capacity_count: 1
                            }
                        })
                        .exec()
                        .then(data => {
                            booking
                                .save()
                                .then(data => {
                                    console.log(data);
                                    return res.status(200).json({
                                        success: true,
                                        message: 'Parking Successfully Booked',
                                        data: {
                                            booking_id: data.booking_id,
                                            patch_id: req.body.patch_id,
                                            user_id: data.user_id,
                                            vehicleNo: data.vehicleNo
                                        }
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(
                                err +
                                "\n" +
                                "Problem in capacity of freehand is full in database in api/rest/v1/easeparking/bookings/add url"
                            );
                            return res.status(500).json({
                                success: false,
                                message: "Resource Unavailable At This Moment"
                            });

                        });
                }
                //Check the capacity of patch and increment the capacity_count by 1
                else if (ans[0].capacity_count === 0 && ans[0].patch_type === 'patch') {
                    booking._pid = ans[0]._id;
                    Parking
                        .update({
                            patch_id: req.body.patch_id
                        }, {
                            $set: {
                                capacity_count: 1
                            }
                        })
                        .exec()
                        .then(data => {
                            booking
                                .save()
                                .then(data => {
                                    return res.status(200).json({
                                        success: true,
                                        message: 'Parking Successfully Booked',
                                        data: {
                                            booking_id: data.booking_id,
                                            patch_id: req.body.patch_id,
                                            user_id: data.user_id,
                                            vehicleNo: data.vehicleNo
                                        }
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(
                                err +
                                "\n" +
                                "Problem in capacity of patch is full in database in api/rest/v1/easeparking/bookings/add url"
                            );
                            return res.status(500).json({
                                success: false,
                                message: "Resource Unavailable At This Moment"
                            });
                        });
                } else {
                    //Capacity is full for the respective booking order and more booking should not be allowed
                    res.status(500).json({
                        success: false,
                        message: "Capacity is full for the current order. Kindly wait for booking completion"
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: "Patch Does Not Exist"
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
                "Problem in inserting new booking in database in api/rest/v1/easeparking/bookings/add url"
            );
        });
};

exports.bookings_getAllBookedPatch = (req, res, next) => {
    Booking
        .find({
            book_status: true
        })
        .populate('user_id', 'vehicle name _id')
        .populate('_pid')
        .exec()
        .then(results => {

            res.status(200).json({
                success: true,
                message: 'Successfully Fetched All Bookings',
                data: results.map(result => {
                    let mycolor = result._pid.color;
                    if (result._pid.patch_type === 'patch') {
                        mycolor = '#000000';
                    } else if (result._pid.capacity === result._pid.capacity_count) {
                        mycolor = '#4f4f4f';
                    } else if (result._pid.capacity / 2 <= result._pid.capacity_count) {
                        mycolor = '#f4a142';
                    }
                    return {
                        patch_id: result._pid.patch_id,
                        booking_id: result.booking_id,
                        start_time: result.start_time,
                        start_date: result.start_date,
                        end_time: result.end_time,
                        end_date: result.end_date,
                        vehicleNo: result.vehicleNo,
                        book_status: result.book_status,
                        color: mycolor,
                        _pid: {
                            capacity: result._pid.capacity,
                            capacity_count: result._pid.capacity_count,
                            _id: result._pid._id,
                            patch_type: result._pid.patch_type
                        },
                        user_id: result.user_id
                    };
                })
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
                "Problem in fetching booking in database in api/rest/v1/easeparking/bookings/all url"
            );
        });
};

exports.bookings_disablePatch = (req, res, next) => {
    Booking.find({
            user_id: req.body.user_id,
            book_status: true
        })
        .exec()
        .then(result => {
            console.log(result);
            Parking
                .updateOne({
                    _id: result[0]._pid
                }, {
                    $inc: {
                        capacity_count: -1
                    }
                })
                .exec()
                .then(data => {
                    Booking
                        .updateOne({
                            user_id: req.body.user_id,
                            book_status: true
                        }, {
                            $set: {
                                end_time: req.body.end_time,
                                end_date: req.body.end_date,
                                book_status: false
                            }
                        })
                        .exec();
                    return res.status(200).json({
                        status: true,
                        message: "Booking removed"
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        message: "Patch Does Not Exist"
                    });
                    console.log(
                        err +
                        "\n" +
                        "Problem in ending booking patch does not exist in database in api/rest/v1/easeparking/bookings/disable url"
                    );
                });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                message: "Booking Does Not Exist"
            });
        });
};