import express from 'express';
import {requestSellerStatus, getSellerRequests, updateSellerRequest, getSellerRequestStatus} from '../controllers/sellerController.js';

const router = express.Router();

router.post('/request', requestSellerStatus);
router.get('/requests', getSellerRequests);
router.put('/update', updateSellerRequest);
router.get('/status/:userID', getSellerRequestStatus);

export default router;