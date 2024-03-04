import express from 'express';
import { addPost, getPost, deletePosts, getOwnPosts, getAllPosts, filterPosts } from './controller/clientcontroller.js';
import { verifyRoles } from '../../middlewares/verifyroles.js';
const router = express.Router();

// Create post route
router.post('/addposts', verifyRoles('client'), addPost);

// Get all posts route
router.get('/showpost/:postId', getPost)
router.get('/getAllPosts', getAllPosts)
router.get('/search', filterPosts)
//get own posts
router.get('/ownposts', verifyRoles('client'), getOwnPosts)

// Delete post route
router.delete('/deleteposts/:postId', verifyRoles('client'), deletePosts)

export default router;