const express = require('express');
const {
    register,
    getUser,
    deleteUser,
    login,
    logout,
    updateProfile,
    getUserById,
    updatePassword,
} = require('../Controller/userController');
const { verifyToken } = require('../Middleware/jwtAuth');
const router = express.Router();

router.get('/', verifyToken, getUser);
router.get('/:id', verifyToken, getUserById);

router.post('/logout', verifyToken, logout);
router.post('/register', register);
router.post('/login', login);

router.put('/update-profile/:id', verifyToken, updateProfile);
router.put('/update-password/:id', verifyToken, updatePassword);

router.delete('/delete/account/:id', verifyToken, deleteUser);

module.exports = router;
