const Parking = require('../models/parkings');

exports.parkings_addParking = (req, res, next) => {
    const parking = new Parking({
        patch_id: Math.floor(100000000 + Math.random() * 900000000),
        name: req.body.name,
        landmark: req.body.landmark,
        city: req.body.city,
        pincode: req.body.pincode,
        state: req.body.state,
        patch_type: req.body.patch_type,
        color: req.body.color,
        capacity: req.body.capacity,
        createdBy: req.body.id,
        coordinates: req.body.coordinates
    });
    parking
        .save()
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Parking Coordinate Added Successfully.',
                data: {
                    id: result._id,
                    patch_id: result.patch_id,
                    color: result.color,
                    patch_active: result.patch_active,
                    capacity: result.capacity,
                    patch_type: result.patch_type
                }
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
                "Problem in inserting new coordinate in database in api/rest/v1/easeparking/parkings/add url"
            );
        });
};

exports.parkings_fetchAllParkings = (req, res, next) => {
    Parking
        .find()
        .exec()
        .then(results => {
            res.status(200).json({
                success: true,
                message: 'Successfully fetch all coordinates',
                data: results.map(result => {
                    return {
                        id: result._id,
                        patch_id: result.patch_id,
                        color: result.color,
                        patch_active: result.patch_active,
                        book_count: result.book_count,
                        capacity: result.capacity,
                        capacity_count: result.capacity_count,
                        patch_type: result.patch_type,
                        coordinates: result.coordinates
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
                "Problem in fetching coordinates from database in api/rest/v1/easeparking/parkings/all url"
            );
        });
};

exports.parkings_fetchBookedCount = (req, res, next) => {
    Parking
        .find({
            patch_id: req.params.id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: 'Patch with id ' + result[0].patch_id + ' retrieved successfully',
                patch_type: result[0].patch_type,
                capacity: result[0].capacity,
                capacity_count: result[0].capacity_count,
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
                "Problem in fetching specific patch from database in api/rest/v1/easeparking/parkings/{:id} url"
            );
        });
};