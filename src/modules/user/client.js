import express from 'express';
import { addPost, getPost, deletePosts, getOwnPosts, getAllPosts, filterPosts, updatePost, uploadCover, applyCount } from './controller/clientcontroller.js';
import { verifyRoles } from '../../middlewares/verifyroles.js';
import rolesList from '../../../config/roleslist.js';
import upload from "../../middlewares/multercloud.js";
import FILE_LIST from "../../../config/filelist.js";
import { verifyFile } from "../../middlewares/verifyfile.js";

const router = express.Router();

// Create post route
router.post('/addpost', verifyRoles('client'), addPost);

// Get all posts route
router.get('/showpost/:postId', getPost)
router.get('/getAllPosts', getAllPosts)
router.get('/search', filterPosts)
//get own posts
router.get('/ownposts', verifyRoles('client'), getOwnPosts)
//
router.put('/updatePost/:postId', updatePost)
// Delete post route
router.delete('/deletepost/:postId', verifyRoles('client'), deletePosts)
//Set post cover img
router.patch('/cover/add/:postId',
    verifyRoles(rolesList.Client),
    upload.single('file'),
    verifyFile(FILE_LIST.image),
    uploadCover);
//Show apply count
router.get('/applycount/:postId', verifyRoles(rolesList.Client), applyCount);
export default router;