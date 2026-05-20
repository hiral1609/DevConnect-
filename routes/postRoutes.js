const express = require('express');
const router = express.Router();
const { createPost, getFeed, likePost, deletePost, commentPost, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .post(protect, upload.single('media'), createPost)
    .get(protect, getFeed);

router.route('/:id')
    .delete(protect, deletePost);

router.route('/:id/like')
    .post(protect, likePost);

router.route('/:id/comment')
    .post(protect, commentPost);

router.route('/user/:id')
    .get(protect, getUserPosts);

module.exports = router;
