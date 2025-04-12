import express from 'express';
import { getUser, removeProfileImage, updateUser } from '../controllers/userController.js';
import { getPropertyByUser } from '../controllers/propertyController.js';
import formidable from 'express-formidable';

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id",formidable(), updateUser);
router.delete('/:id/image', removeProfileImage);

router.get('/:userId/properties', getPropertyByUser);

export default router;
