import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { getPropertyByUser } from '../controllers/propertyController.js';

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);

router.get('/:userId/properties', getPropertyByUser);

export default router;
