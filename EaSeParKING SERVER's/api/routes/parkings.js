const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkings');

/* @POST(/api/rest/v1/easeparking/parkings/register) */
router.post('/add', parkingController.parkings_addParking);

/* @GET(/api/rest/v1/easeparking/parkings/login) */
router.get('/all', parkingController.parkings_fetchAllParkings);

/* @GET(/api/rest/v1/easeparking/parkings/{id}) */
router.get('/:id', parkingController.parkings_fetchBookedCount);

module.exports = router;