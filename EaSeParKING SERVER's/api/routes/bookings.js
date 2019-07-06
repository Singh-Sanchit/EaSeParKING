const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookings');

/* @POST(/api/rest/v1/easeparking/bookings/add) */
router.post('/add', bookingController.bookings_addNewBooking);

/* @GET(/api/rest/v1/easeparking/bookings/login) */
router.get('/all', bookingController.bookings_getAllBookedPatch);

/* @PATCH(/api/rest/v1/easeparking/bookings/disable) */
router.patch('/disable', bookingController.bookings_disablePatch);

module.exports = router;