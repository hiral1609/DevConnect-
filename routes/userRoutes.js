const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, searchUsers, followUser, deleteProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/search', searchUsers);
router.route('/profile/:id').get(protect, getProfile);
router.route('/profile')
    .put(protect, upload.single('profilePic'), updateProfile)
    .delete(protect, deleteProfile);
router.route('/:id/follow').post(protect, followUser);

module.exports = router;
