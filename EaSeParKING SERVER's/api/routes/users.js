const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

/* @POST(/api/rest/v1/easeparking/users/register) */
router.post('/register', userController.users_register);

/* @POST(/api/rest/v1/easeparking/users/login) */
router.post('/login', userController.users_login);

module.exports = router;