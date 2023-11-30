import express from 'express';
import { createListing,deleteListing} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router =  express.Router();

router.delete('/delete/:id', verifyToken,deleteListing);
router.post('/create', verifyToken , createListing);



export default router;