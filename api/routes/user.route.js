import express from "express";
import {deleteUser, getUserListing, test, updateUser,getUserData} from '../controllers/user.controller.js';
import { verifyToken } from "../utils/verifyUser.js";


const router = express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken ,updateUser);
router.delete('/delete/:id',verifyToken, deleteUser);

//get the user listings
router.get('/listings/:id',verifyToken , getUserListing)

router.get('/:id',verifyToken, getUserData);


export default router;