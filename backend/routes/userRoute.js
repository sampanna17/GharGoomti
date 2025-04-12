import express from 'express';
import { checkSubscriptionStatus, getUser, removeProfileImage, subscribeToNotifications, unsubscribeFromNotifications, updateUser } from '../controllers/userController.js';
import { getPropertyByUser } from '../controllers/propertyController.js';
import formidable from 'express-formidable';

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id",formidable(), updateUser);
router.delete('/:id/image', removeProfileImage);

router.get('/:userId/properties', getPropertyByUser);

router.put('/:id/subscribe', subscribeToNotifications);
router.put('/:id/unsubscribe', unsubscribeFromNotifications);
router.get('/:id/subscription-status', checkSubscriptionStatus);


export default router;
